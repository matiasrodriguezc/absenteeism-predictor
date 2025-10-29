import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={`font-sans antialiased`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
