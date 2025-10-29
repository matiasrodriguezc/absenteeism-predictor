# Absenteeism Prediction MLOps Project

## 📜 Overview

This project implements an end-to-end MLOps system for predicting workplace absenteeism hours. It features a web application for users to get predictions and register new absence events, an automated retraining pipeline using Airflow, and an analytical dashboard built with Tableau. The system is designed with a decoupled architecture, separating the frontend, backend API, database, and MLOps components.

---

## 🏗️ Architecture

The system consists of the following components:

* **Frontend:** A Next.js application (using React and Tailwind CSS) deployed on **Vercel**[https://absenteeism-predictor.vercel.app]. Provides the user interface for prediction and data entry.
* **Backend API:** A FastAPI application (Python) deployed on **Hugging Face Spaces**. Serves the machine learning model (Random Forest Regressor) and handles database interactions.
* **Database:** **Vercel Postgres** (powered by Neon). Stores employee data, absence events, reason codes, and prediction logs. Serves as the single source of truth.
* **Model Store:** **Vercel Blob**. Stores the trained `model.joblib` (Random Forest) and `scaler.joblib` (StandardScaler) artifacts.
* **MLOps Orchestrator:** **Apache Airflow** (running via Docker). Manages the automated retraining pipeline based on new data added to the database.
* **Analytics Dashboard:** **Tableau Public**. Connects directly to Vercel Postgres to visualize historical data and trends, embedded within the frontend application.

## 💻 Tech Stack

* **Frontend:** Next.js 14, React 18, Tailwind CSS, TypeScript
* **Backend:** Python 3.11+, FastAPI, Uvicorn
* **ML Model:** Scikit-learn (RandomForestRegressor, StandardScaler), Joblib
* **Database:** PostgreSQL (Vercel Postgres / Neon)
* **DB Interaction:** SQLAlchemy, Psycopg2
* **API Hosting:** Hugging Face Spaces (Docker)
* **Frontend Hosting:** Vercel
* **File Storage:** Vercel Blob
* **Orchestration:** Apache Airflow, Docker
* **Package Management:** pnpm (Frontend), pip (Backend/Airflow)
* **Analytics:** Tableau Public

---

## 📁 Project Structure

This repository contains the **Frontend** application deployed on Vercel.

* `/app`: Contains the Next.js pages (Predictor `/`, Add Absence `/add-absence`, Dashboard `/dashboard`).
* `/components`: Reusable React components (UI elements from Shadcn/ui).
* `/lib`: Utility functions (if any).
* `/public`: Static assets.
* `package.json`: Frontend dependencies and scripts.
* `next.config.mjs`: Next.js configuration.
* `.gitignore`: Specifies intentionally untracked files.

**Separate Components (Managed elsewhere):**

* **Backend API:** Resides in its own directory/repository, deployed to Hugging Face Spaces. Contains `app.py`, `requirements.txt`, `model.joblib`, `scaler.joblib`, `README.md`, `Dockerfile`.
* **Airflow:** Configuration and DAG files reside in an Airflow setup (e.g., using `docker-compose`).

---

## 🛠️ Setup & Installation (Local Development)

### Prerequisites

* Node.js (v20 or later recommended)
* pnpm (`npm install -g pnpm`)
* Python (v3.11+ recommended, install via Homebrew on Mac)
* Docker & Docker Compose (for Airflow)
* Access credentials for Vercel Postgres and Vercel Blob.

### Steps

1.  **Clone the Frontend Repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)matiasrodriguezc/absenteeism-predictor.git
    cd absenteeism-predictor
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up Backend API Locally (Optional but Recommended):**
    * Clone your separate backend repository.
    * Create a Python virtual environment: `python3.11 -m venv venv`
    * Activate it: `source venv/bin/activate`
    * Install dependencies: `pip install -r requirements.txt`
    * Create a `.env` file with `POSTGRES_URL`.
    * Ensure `model.joblib` and `scaler.joblib` are present (download from Vercel Blob or run training script).

4.  **Set up Database:**
    * Ensure your Vercel Postgres instance is created.
    * Run the initial table creation SQL scripts if not done already.
    * Run the data migration script (`migrate_data.py` - you might need to adapt it with DB credentials) to populate the database from CSVs initially.

5.  **Set up Airflow (Optional - for testing MLOps):**
    * Navigate to your Airflow directory.
    * Configure `docker-compose.yml` if needed.
    * Set up Airflow Connections (`postgres_absenteeism`) and Variables (`VERCEL_BLOB_TOKEN`) in the Airflow UI.
    * Place the DAG file (`dag_retrain_absenteeism.py`) in the `dags` folder.

6.  **Environment Variables (Frontend):**
    * `vercel dev` should automatically pull variables from your linked Vercel project into a `.env.local` file. Ensure this file contains the correct `POSTGRES_URL` and `BLOB_READ_WRITE_TOKEN` if needed by any local scripts, *but the frontend itself doesn't directly use them*. The frontend only needs the URL of the deployed Hugging Face API.

---

## ▶️ Running Locally

1.  **Start the Frontend & Vercel Dev Environment:**
    * Activate your Python venv: `source venv/bin/activate` (Vercel CLI might need Python access).
    * Run:
        ```bash
        vercel dev
        ```
    * Access the frontend at `http://localhost:3000`. This command simulates the Vercel environment and proxies API calls.

2.  **Start the Backend API (if running locally):**
    * Navigate to your `backend-api` directory.
    * Activate its venv: `source venv/bin/activate`
    * Run:
        ```bash
        uvicorn app:app --reload --port 8000
        ```
    * **(Important):** If running the backend locally, update the `fetch` URLs in your frontend code to point to `http://localhost:8000` instead of the Hugging Face URL.

3.  **Start Airflow (if running locally):**
    * Navigate to your Airflow directory.
    * Run:
        ```bash
        docker-compose up -d
        ```
    * Access the Airflow UI at `http://localhost:8080`.

---

## 🚀 Deployment

* **Frontend (Vercel):** Deployment is automatic via Git push to the `main` branch connected to your Vercel project.
* **Backend (Hugging Face Spaces):** Upload or push changes (`app.py`, `requirements.txt`) to your Hugging Face Space repository/files. Restart the Space if needed.
* **Database (Vercel Postgres):** Managed by Vercel/Neon.
* **Model Artifacts (Vercel Blob):** Updated automatically by the Airflow pipeline.

---

## 🔄 MLOps Pipeline (Airflow)

The `dag_retrain_absenteeism.py` DAG orchestrates the automated retraining process:

1.  **Trigger:** A `NewAbsenceSensor` runs hourly, checking the `absence_events` table for rows where `processed_for_training = FALSE`. The DAG proceeds only when the count reaches 100 or more.
2.  **Get Data:** Extracts all historical data from Vercel Postgres using a SQL query that replicates the necessary preprocessing (creating `Reason_X` columns, etc.).
3.  **Train Model:** Trains a new `RandomForestRegressor` and `StandardScaler` using the extracted data.
4.  **Upload Artifacts:** Saves the new `model.joblib` and `scaler.joblib` and uploads them to **Vercel Blob**, overwriting the previous versions.
5.  **Mark Data:** Updates the processed rows in `absence_events` by setting `processed_for_training = TRUE`.
6.  **Trigger Redeploy (Optional):** Sends a request to a Vercel Deploy Hook to force the frontend application to redeploy, ensuring the API (if it were on Vercel) or any server component picks up the latest model (though in the current setup, the Hugging Face API needs restarting/redeploying separately if it were to auto-load models).

---

## 📊 Analytics (Tableau)

* A Tableau Public dashboard provides visual insights into the absenteeism data.
* It connects **directly** to the **Vercel Postgres** database as a live data source.
* The dashboard is embedded as an `<iframe>` within the `/dashboard` page of the Next.js application.
* To update the dashboard, refresh the data source in Tableau Desktop and republish to Tableau Public.

---

## 🔗 API Endpoints (Hosted on Hugging Face)

* **`GET /`**: Health check endpoint. Returns status of API, model loading, and DB connection.
* **`POST /predict`**: Accepts employee data (JSON payload matching `PredictionInput` Pydantic model) and returns predicted absenteeism hours (e.g., `{"predicted_hours": 4.5}`). Logs the prediction to the database.
* **`POST /add_absence`**: Accepts new absence event data (JSON payload matching `NewAbsence` Pydantic model) and inserts it into the `absence_events` table in the database.

---
