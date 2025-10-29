from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from vercel_blob import get
from sqlalchemy import create_engine, text
import os
import sys
from datetime import date

# --- Configuración y Carga del Modelo ---
app = FastAPI()

# Ruta escribible en Vercel Serverless
MODEL_PATH = '/tmp/model.joblib'
SCALER_PATH = '/tmp/scaler.joblib'

# Conexión a la DB (Vercel inyecta las variables de entorno)
DB_URL = os.environ.get("POSTGRES_URL")
engine = None
if DB_URL:
    try:
        engine = create_engine(DB_URL)
    except Exception as e:
        print(f"Error al crear engine de DB: {e}")

def load_model_from_blob():
    """Descarga modelos desde Vercel Blob a /tmp/"""
    print("Iniciando carga de modelo desde Vercel Blob...")
    try:
        # Descarga el modelo
        model_blob = get('model.joblib')
        with open(MODEL_PATH, 'wb') as f:
            f.write(model_blob.read())
        
        # Descarga el escalador
        scaler_blob = get('scaler.joblib')
        with open(SCALER_PATH, 'wb') as f:
            f.write(scaler_blob.read())
        
        print("Modelos descargados. Cargando en memoria...")
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        print("¡Modelo y escalador cargados con éxito!")
        return model, scaler
        
    except Exception as e:
        print(f"Error fatal al cargar modelos desde Blob: {e}", file=sys.stderr)
        return None, None

# --- Variables Globales ---
model, scaler = load_model_from_blob()
model_inputs_cols = [
                    'Reason_1', 'Reason_2', 'Reason_3', 'Reason_4', 'Month_Value', 
                    'Day_of_the_Week', 'Transportation_Expense', 'Distance_to_Work', 
                    'Age', 'Daily_Work_Load_Average', 'Body_Mass_Index', 
                    'education_id', 'Children', 'Pets'] # 'education_id' coincide con tu SQL

# --- Modelo Pydantic para la PREDICCIÓN ---
class PredictionInput(BaseModel):
    Reason_Group: int # 1, 2, 3, o 4
    Month_Value: int
    Day_of_the_Week: int
    Transportation_Expense: int
    Distance_to_Work: int
    Age: int
    Daily_Work_Load_Average: float
    Body_Mass_Index: int
    Education: int # El 'education_id' (1, 2, 3, o 4)
    Children: int
    Pet: int

# --- Modelo Pydantic para AÑADIR AUSENCIA ---
class NewAbsence(BaseModel):
    employee_id: int
    reason_id: int # El ID crudo (ej. 1 a 28)
    absence_date: date # Formato "YYYY-MM-DD"
    absenteeism_time_hours: int

# --- Endpoint 1: PREDECIR (/api/predict) ---
@app.post("/api/predict")
async def predict(data: PredictionInput):
    if not model or not scaler:
        print("Error: El modelo no está cargado.", file=sys.stderr)
        return {"error": "El modelo no está cargado. Revisa los logs del servidor."}, 500

    try:
        # 1. Transformar input amigable a input de modelo
        input_dict = data.dict()
        input_dict['Reason_1'] = 1 if input_dict['Reason_Group'] == 1 else 0
        input_dict['Reason_2'] = 1 if input_dict['Reason_Group'] == 2 else 0
        input_dict['Reason_3'] = 1 if input_dict['Reason_Group'] == 3 else 0
        input_dict['Reason_4'] = 1 if input_dict['Reason_Group'] == 4 else 0
        input_dict['education_id'] = input_dict['Education'] # Renombrar
        
        # Quitar los campos que no van al modelo
        del input_dict['Reason_Group']
        del input_dict['Education']

        # 2. Crear DataFrame y escalar
        input_df = pd.DataFrame([input_dict], columns=model_inputs_cols)
        input_scaled = scaler.transform(input_df)

        # 3. Predecir
        prediction = model.predict(input_scaled)
        predicted_hours = round(float(prediction[0]), 2) # Ej: 4.58

        # 4. Guardar log en DB
        if engine:
            try:
                with engine.connect() as conn:
                    stmt = text("INSERT INTO prediction_logs (input_data, predicted_hours) VALUES (:data, :pred)")
                    conn.execute(stmt, parameters={"data": data.model_dump_json(), "pred": predicted_hours})
                    conn.commit()
            except Exception as e:
                print(f"Error al guardar log en DB: {e}", file=sys.stderr)
        
        return {"predicted_hours": predicted_hours}

    except Exception as e:
        print(f"Error en predicción: {e}", file=sys.stderr)
        return {"error": f"Error en la predicción: {str(e)}"}, 500

# --- Endpoint 2: AÑADIR AUSENCIA (/api/add_absence) ---
@app.post("/api/add_absence")
async def add_absence(data: NewAbsence):
    if not engine:
        return {"success": False, "error": "Conexión a base de datos no configurada"}, 500
        
    try:
        with engine.connect() as conn:
            stmt = text(
                """INSERT INTO absence_events 
                   (employee_id, reason_id, absence_date, absenteeism_time_hours, processed_for_training) 
                   VALUES (:id, :reason, :date, :hours, FALSE)"""
            )
            conn.execute(stmt, parameters={
                "id": data.employee_id,
                "reason": data.reason_id,
                "date": data.absence_date,
                "hours": data.absenteeism_time_hours
            })
            conn.commit()
        return {"success": True, "message": "Ausencia registrada."}
    except Exception as e:
        print(f"Error al añadir ausencia: {e}", file=sys.stderr)
        return {"success": False, "error": str(e)}, 500

# Endpoint de salud para verificar que la API funciona
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "model_loaded": model is not None, "db_connected": engine is not None}