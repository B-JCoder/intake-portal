"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Project {
  id: string
  businessName: string
  websiteType: string
  budget: number
  estimatedCost: number
  features: string[]
  numberOfPages: number
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const projectId = searchParams.get("projectId")
  const [project, setProject] = useState<Project | null>(null)
  const [paymentOption, setPaymentOption] = useState("full")
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        throw new Error("Project not found")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      })
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!project) return

    setLoading(true)
    try {
      const amount = paymentOption === "full" ? project.estimatedCost : project.estimatedCost * 0.5

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          amount: amount * 100, // Convert to cents
          paymentType: paymentOption,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        // Redirect to Stripe Checkout
        window.location.href = url
      } else {
        throw new Error("Failed to create payment session")
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>Project not found</p>
        </div>
      </div>
    )
  }

  const fullAmount = project.estimatedCost
  const halfAmount = project.estimatedCost * 0.5

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
            <CardDescription>Complete your payment to get started on your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Project Summary</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Business:</strong> {project.businessName}
                </p>
                <p>
                  <strong>Type:</strong> {project.websiteType}
                </p>
                <p>
                  <strong>Pages:</strong> {project.numberOfPages}
                </p>
                <p>
                  <strong>Features:</strong> {project.features.join(", ")}
                </p>
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <h3 className="font-semibold mb-4">Payment Options</h3>
              <RadioGroup value={paymentOption} onValueChange={setPaymentOption}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Pay in Full</p>
                        <p className="text-sm text-gray-600">Complete payment now</p>
                      </div>
                      <p className="text-lg font-bold">${fullAmount.toLocaleString()}</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="deposit" id="deposit" />
                  <Label htmlFor="deposit" className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">50% Deposit</p>
                        <p className="text-sm text-gray-600">Pay remaining 50% on completion</p>
                      </div>
                      <p className="text-lg font-bold">${halfAmount.toLocaleString()}</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Cost Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Project Cost</span>
                <span>${fullAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Amount</span>
                <span className="font-bold">
                  ${(paymentOption === "full" ? fullAmount : halfAmount).toLocaleString()}
                </span>
              </div>
              {paymentOption === "deposit" && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Remaining Balance</span>
                  <span>${halfAmount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Secure payment powered by Stripe</span>
            </div>

            {/* Payment Button */}
            <Button onClick={handlePayment} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                `Pay $${(paymentOption === "full" ? fullAmount : halfAmount).toLocaleString()}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
