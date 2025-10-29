export default function DashboardPage() {
  return (
    <div className="container py-8 px-4 md:py-12 md:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-pretty">Interactive analysis of historical absenteeism data.</p>
      </div>

      <div className="w-full h-[80vh] rounded-lg border-2 border-dashed border-border bg-card flex items-center justify-center shadow-lg">
        <div className="text-center space-y-4 p-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Embedded Tableau Dashboard Container</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Integrate your Tableau dashboard here using an iframe or Tableau visualization component
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
