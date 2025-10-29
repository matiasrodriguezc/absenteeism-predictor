"use client"

import type React from "react"
import { useState } from "react"
import Link from 'next/link'
import { Github, Linkedin, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

// API Payload Interface
interface ApiPayload {
  Reason_Group: number
  Month_Value: number
  Day_of_the_Week: number
  Transportation_Expense: number
  Distance_to_Work: number
  Age: number
  Daily_Work_Load_Average: number
  Body_Mass_Index: number
  Education: number
  Children: number
  Pet: number
}

export default function PredictorPage() {
  const [prediction, setPrediction] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setPrediction(null)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData)

      const payload: ApiPayload = {
        Reason_Group: parseInt(data.Reason_Group as string),
        Month_Value: parseInt(data.Month_Value as string),
        Day_of_the_Week: parseInt(data.Day_of_the_Week as string),
        Transportation_Expense: parseInt(data.Transportation_Expense as string),
        Distance_to_Work: parseInt(data.Distance_to_Work as string),
        Age: parseInt(data.Age as string),
        Daily_Work_Load_Average: parseFloat(data.Daily_Work_Load_Average as string),
        Body_Mass_Index: parseInt(data.Body_Mass_Index as string),
        Education: parseInt(data.Education as string),
        Children: parseInt(data.Children as string),
        Pet: parseInt(data.Pet as string),
      }

      // Ensure this URL points to your Hugging Face API
      const response = await fetch("https://matiasrodriguezc-mi-api-absentismo.hf.space/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error in API request")
      }

      if (result.predicted_hours !== undefined) {
        setPrediction(result.predicted_hours)
      } else {
        throw new Error("API did not return a valid prediction.")
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // Add 'relative' to the main container
    <div className="container max-w-5xl py-8 px-4 md:py-12 md:px-6 relative">

      {/* --- SOCIAL LINKS CONTAINER --- */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 flex space-x-4">
        <a
          href="https://github.com/matiasrodriguezc"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/matiasrodriguezc"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Linkedin size={24} />
        </a>
        <a
          href="mailto:matiasrodriguezc01@gmail.com"
          aria-label="Send Email"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Mail size={24} />
        </a>
      </div>
      {/* --- END SOCIAL LINKS --- */}


      <div className="mb-8 space-y-2 pt-12 md:pt-0"> {/* Added padding-top for mobile */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
          Absenteeism Prediction Calculator
        </h1>
        <p className="text-muted-foreground text-pretty">
          Enter employee data to estimate probable absence hours.
        </p>
      </div>

      {/* --- Card and Form --- */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Employee Data</CardTitle>
          <CardDescription>Complete all fields to get a prediction.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Select required name="Reason_Group">
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Illness (Group 1)</SelectItem>
                    <SelectItem value="2">Pregnancy or Childbirth (Group 2)</SelectItem>
                    <SelectItem value="3">Injury or Poisoning (Group 3)</SelectItem>
                    <SelectItem value="4">Medical Appointment / Other (Group 4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Select required name="Education">
                  <SelectTrigger id="education">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">High School (ID 1)</SelectItem>
                    <SelectItem value="2">University (ID 2)</SelectItem>
                    <SelectItem value="3">Graduate (ID 3)</SelectItem>
                    <SelectItem value="4">Master/Doctorate (ID 4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Input id="month" name="Month_Value" type="number" placeholder="1-12" min="1" max="12" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="day">Day of Week</Label>
                <Input id="day" name="Day_of_the_Week" type="number" placeholder="0-6" min="0" max="6" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transport">Transportation Expense ($)</Label>
                <Input id="transport" name="Transportation_Expense" type="number" placeholder="0" min="0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance">Distance to Work (km)</Label>
                <Input id="distance" name="Distance_to_Work" type="number" placeholder="0" min="0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="Age" type="number" placeholder="18" min="18" max="100" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workload">Workload (average)</Label>
                <Input id="workload" name="Daily_Work_Load_Average" type="number" step="0.01" placeholder="0.00" min="0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bmi">BMI</Label>
                <Input id="bmi" name="Body_Mass_Index" type="number" placeholder="25" min="10" max="50" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <Input id="children" name="Children" type="number" placeholder="0" min="0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pets">Pets</Label>
                <Input id="pets" name="Pet" type="number" placeholder="0" min="0" required />
              </div>
            </div>

            <Button type="submit" className="w-full text-base font-semibold" disabled={isLoading}>
              {isLoading ? "Calculating..." : "Predict Absence Hours"}
            </Button>

            {prediction !== null && (
              <Alert className="border-primary/50 bg-primary/5">
                <AlertDescription className="text-center">
                  <span className="text-sm text-muted-foreground">Predicted Hours:</span>
                  <div className="mt-1 text-4xl font-bold text-primary">{prediction.toFixed(1)}</div>
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
    </div>
  )
}