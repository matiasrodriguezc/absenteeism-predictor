import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google" // Asegúrate de que esté Manrope
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"

// Configura Manrope
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "Absenteeism System",
  description: "MLOps system for workplace absenteeism prediction",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.className} antialiased`}>
        <Navigation />
        {/* AÑADE LAS CLASES DE CENTRADO AQUÍ */}
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}