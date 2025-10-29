"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// --- 1. Reference Data (Translated) ---
const reasonData = [
  { id: 0, desc: 'No Reason', group: 0 },
  { id: 1, desc: 'Infectious and parasitic diseases', group: 1 },
  { id: 2, desc: 'Neoplasms', group: 1 },
  { id: 3, desc: 'Diseases of the blood', group: 1 },
  { id: 4, desc: 'Endocrine diseases', group: 1 },
  { id: 5, desc: 'Mental and behavioral disorders', group: 1 },
  { id: 6, desc: 'Diseases of the nervous system', group: 1 },
  { id: 7, desc: 'Diseases of the eye', group: 1 },
  { id: 8, desc: 'Diseases of the ear', group: 1 },
  { id: 9, desc: 'Diseases of the circulatory system', group: 1 },
  { id: 10, desc: 'Diseases of the respiratory system', group: 1 },
  { id: 11, desc: 'Diseases of the digestive system', group: 1 },
  { id: 12, desc: 'Diseases of the skin', group: 1 },
  { id: 13, desc: 'Musculoskeletal diseases', group: 1 },
  { id: 14, desc: 'Genitourinary diseases', group: 1 },
  { id: 15, desc: 'Pregnancy, childbirth', group: 2 },
  { id: 16, desc: 'Perinatal conditions', group: 2 },
  { id: 17, desc: 'Congenital malformations', group: 2 },
  { id: 18, desc: 'Abnormal clinical/lab findings', group: 3 },
  { id: 19, desc: 'Injury, poisoning', group: 3 },
  { id: 20, desc: 'External causes of morbidity', group: 3 },
  { id: 21, desc: 'Contact with health services', group: 3 },
  { id: 22, desc: 'Medical consultation', group: 4 },
  { id: 23, desc: 'Dental consultation', group: 4 },
  { id: 24, desc: 'Physiotherapy', group: 4 },
  { id: 25, desc: 'Unjustified absence', group: 4 },
  { id: 26, desc: 'Justified absence', group: 4 },
  { id: 27, desc: 'Duty leave', group: 4 },
  { id: 28, desc: 'Blood donation', group: 4 }
]

export default function AddAbsencePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        employee_id: parseInt(formData.get("employee_id") as string),
        reason_id: parseInt(formData.get("reason_id") as string),
        absence_date: formData.get("absence_date") as string,
        absenteeism_time_hours: parseInt(formData.get("absenteeism_time_hours") as string),
      }

      if (!data.absence_date) {
        throw new Error("Absence date is required.")
      }
      
      const response = await fetch("/api/add_absence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || result.success === false) {
        throw new Error(result.error || "Failed to register absence")
      }

      setSuccess(result.message || "Absence registered successfully.")
      e.currentTarget.reset() // Clear form on success

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-5xl py-8 px-4 md:py-12 md:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
          Register New Absence
        </h1>
        <p className="text-muted-foreground text-pretty">
          Enter data for a new absence event for model retraining.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* --- Left Column: The Form --- */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Event Data</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee ID</Label>
                <Input id="employee_id" name="employee_id" type="number" placeholder="e.g., 11" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason_id">Reason ID</Label>
                <Input id="reason_id" name="reason_id" type="number" placeholder="e.g., 22" required />
                <p className="text-xs text-muted-foreground">
                  Use the reference table on the right to find the ID.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="absence_date">Absence Date</Label>
                <Input id="absence_date" name="absence_date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="absenteeism_time_hours">Total Hours Absent</Label>
                <Input id="absenteeism_time_hours" name="absenteeism_time_hours" type="number" placeholder="e.g., 8" min="0" required />
              </div>

              <Button type="submit" className="w-full text-base font-semibold" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save to Database"}
              </Button>

              {success && (
                <Alert className="border-green-500/50 bg-green-500/5">
                  <AlertDescription className="text-center text-green-600">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="border-red-500/50 bg-red-500/5">
                  <AlertDescription className="text-center text-red-600">
                    <span className="font-bold">Error:</span> {error}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>

        {/* --- Right Column: The Reference Table --- */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Reason Reference</CardTitle>
            <CardDescription>Use the corresponding ID in the form.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[450px] overflow-y-auto border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-secondary">
                  <TableRow>
                    <TableHead className="w-[60px]">ID</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reasonData.map((reason) => (
                    <TableRow key={reason.id}>
                      <TableCell className="font-medium">{reason.id}</TableCell>
                      <TableCell>{reason.desc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}