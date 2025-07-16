"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IntakeForm } from "@/components/intake-form"
import type { IntakeFormFullData } from "@/lib/validations"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function IntakePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (data: IntakeFormFullData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Form submitted:", data)

      toast({
        title: "Success!",
        description: "Your project intake has been submitted successfully.",
      })

      // Redirect to success page or dashboard
      router.push("/success")
    } catch (error) {
        console.error("Submission error:", error)
      toast({
        title: "Error",
        description: "Failed to submit intake form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Project Intake Form</CardTitle>
            <CardDescription className="text-lg">
              Tell us about your project and we ll get back to you with a detailed proposal
            </CardDescription>
          </CardHeader>
        </Card>

        <IntakeForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
