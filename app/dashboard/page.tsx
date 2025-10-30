// app/dashboard/page.tsx

export default function DashboardPage() {
  
  // Esta es la URL de tu dashboard, extraída de tu código
  const tableauURL = "https://public.tableau.com/views/Absenteeism_17618499926350/Dashboard1?:embed=y&:display_count=yes&:showVizHome=no"

  return (
    <div className="container py-8 px-4 md:py-12 md:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-pretty">
          Interactive analysis of historical absenteeism data.
        </p>
      </div>

      {/* Aquí reemplazamos el 'placeholder' por el iframe de Tableau.
        Lo metemos en un div con 'overflow-hidden' para que respete los bordes redondeados.
      */}
      <div className="w-full h-[80vh] rounded-lg border bg-card shadow-lg overflow-hidden">
        <iframe
          src={tableauURL}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title="Tableau Dashboard - Absenteeism Analysis"
        >
        </iframe>
      </div>
    </div>
  )
}