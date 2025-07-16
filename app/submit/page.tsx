"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectFormSchema, type ProjectFormData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Calculator, CheckCircle, Loader2 } from "lucide-react"

const FEATURES = [
  { name: "Responsive Design", cost: 500 },
  { name: "SEO Optimization", cost: 300 },
  { name: "Contact Forms", cost: 200 },
  { name: "E-commerce", cost: 1500 },
  { name: "Blog/CMS", cost: 800 },
  { name: "User Authentication", cost: 600 },
  { name: "Payment Integration", cost: 1000 },
  { name: "Analytics", cost: 300 },
  { name: "Social Media Integration", cost: 250 },
  { name: "Custom Functionality", cost: 2000 },
]

const WEBSITE_TYPES = [
  { value: "BUSINESS", label: "Business Website", multiplier: 1 },
  { value: "ECOMMERCE", label: "E-commerce Store", multiplier: 1.5 },
  { value: "PORTFOLIO", label: "Portfolio Site", multiplier: 0.8 },
  { value: "BLOG", label: "Blog/Content Site", multiplier: 0.9 },
  { value: "CUSTOM", label: "Custom Application", multiplier: 2 },
]

export default function SubmitPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { userId } = useAuth()
  const { toast } = useToast()

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      websiteType: "BUSINESS",
      features: [],
      numberOfPages: 5,
      budget: 2000,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
    },
  })

  // Effect to update estimated cost when relevant fields change
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (
        name === "numberOfPages" ||
        name === "websiteType" ||
        (name === "features" && type === "change") // Only re-calculate if features array itself changes
      ) {
        const pages = value.numberOfPages || 0
        const websiteType = value.websiteType || "BUSINESS"
        const features = (value.features || []).filter((f): f is string => typeof f === "string")
        setEstimatedCost(calculateEstimate(pages, features , websiteType))
      }
    })
    // Initial calculation
    const initialPages = form.getValues("numberOfPages")
    const initialWebsiteType = form.getValues("websiteType")
    const initialFeatures = form.getValues("features")
    setEstimatedCost(calculateEstimate(initialPages, initialFeatures, initialWebsiteType))

    return () => subscription.unsubscribe()
  }, [form.watch, form.getValues, form])

  const calculateEstimate = (pages: number, features: string[], websiteType: string) => {
    let baseCost = 1000

    // Page cost
    baseCost += pages * 200

    // Feature cost
    const selectedFeatureCosts = FEATURES.filter((f) => features.includes(f.name)).reduce((sum, f) => sum + f.cost, 0)
    baseCost += selectedFeatureCosts

    // Website type multiplier
    const multiplier = WEBSITE_TYPES.find((t) => t.value === websiteType)?.multiplier || 1
    baseCost *= multiplier

    return Math.round(baseCost)
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const newFeatures = checked ? [...selectedFeatures, feature] : selectedFeatures.filter((f) => f !== feature)
    setSelectedFeatures(newFeatures)
    form.setValue("features", newFeatures, { shouldValidate: true }) // Validate features field immediately
  }

  const onSubmit = async (data: ProjectFormData) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a project.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Ensure deadline is a string in YYYY-MM-DD format for JSON serialization
      const deadlineString = data.deadline instanceof Date ? data.deadline.toISOString().split("T")[0] : data.deadline

      const submitData = {
        ...data,
        deadline: deadlineString, // Send as string
        features: selectedFeatures, // Ensure this is the state-managed array
        estimatedCost,
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        const project = await response.json()
        toast({
          title: "Success",
          description: "Project submitted successfully! Redirecting to payment...",
        })
        router.push(`/payment?projectId=${project.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.message || error.details || "Failed to submit project")
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    let isValid = false
    if (currentStep === 1) {
      isValid = await form.trigger(["businessName", "websiteType"])
    } else if (currentStep === 2) {
      isValid = await form.trigger(["numberOfPages", "features"])
      if (isValid && selectedFeatures.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please select at least one feature.",
          variant: "destructive",
        })
        isValid = false
      }
    } else if (currentStep === 3) {
      isValid = await form.trigger(["deadline", "budget"])
    }

    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const progress = (currentStep / 4) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Project Requirements
            </CardTitle>
            <CardDescription>Tell us about your project so we can provide the best solution</CardDescription>
            <Progress value={progress} className="mt-4" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Basic Information
                  </h3>
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      {...form.register("businessName")}
                      placeholder="Your business name"
                      className="mt-1"
                    />
                    {form.formState.errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.businessName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry (Optional)</Label>
                    <Input
                      id="industry"
                      {...form.register("industry")}
                      placeholder="e.g., Healthcare, Technology, Retail"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Website Type *</Label>
                    <Select
                      value={form.watch("websiteType")}
                      onValueChange={(value) => {
                        form.setValue("websiteType", value as ProjectFormData["websiteType"], { shouldValidate: true })
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WEBSITE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex justify-between items-center w-full">
                              <span>{type.label}</span>
                              <Badge variant="secondary" className="ml-2">
                                {type.multiplier}x
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.websiteType && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.websiteType.message}</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Project Details
                  </h3>
                  <div>
                    <Label htmlFor="numberOfPages">Number of Pages *</Label>
                    <Input
                      id="numberOfPages"
                      type="number"
                      {...form.register("numberOfPages", { valueAsNumber: true })}
                      onChange={(e) => {
                        const pages = Number.parseInt(e.target.value) || 0
                        form.setValue("numberOfPages", pages, { shouldValidate: true })
                      }}
                      className="mt-1"
                      min="1"
                      max="100"
                    />
                    <p className="text-sm text-gray-500 mt-1">$200 per page</p>
                    {form.formState.errors.numberOfPages && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.numberOfPages.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Features Required *</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {FEATURES.map((feature) => (
                        <div key={feature.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={feature.name}
                              checked={selectedFeatures.includes(feature.name)}
                              onCheckedChange={(checked) => handleFeatureChange(feature.name, checked as boolean)}
                            />
                            <Label htmlFor={feature.name} className="text-sm font-medium">
                              {feature.name}
                            </Label>
                          </div>
                          <Badge variant="outline">+${feature.cost}</Badge>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.features && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.features.message}</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Timeline & Budget
                  </h3>
                  <div>
                    <Label htmlFor="deadline">Project Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      {...form.register("deadline", { valueAsDate: true })}
                      className="mt-1"
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {form.formState.errors.deadline && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.deadline.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="budget">Your Budget ($) *</Label>
                    <Input
                      id="budget"
                      type="number"
                      {...form.register("budget", { valueAsNumber: true })}
                      className="mt-1"
                      min="500"
                    />
                    {form.formState.errors.budget && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.budget.message}</p>
                    )}
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
                    <h4 className="font-semibold text-blue-900 mb-2">💰 Estimated Cost</h4>
                    <p className="text-3xl font-bold text-blue-600 mb-2">${estimatedCost.toLocaleString()}</p>
                    <p className="text-sm text-blue-700">Based on your requirements</p>
                    <div className="mt-3 text-xs text-blue-600">
                      <p>
                        Base: $1,000 + Pages: ${form.watch("numberOfPages") * 200} + Features: $
                        {FEATURES.filter((f) => selectedFeatures.includes(f.name)).reduce((sum, f) => sum + f.cost, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Review & Submit
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Business</p>
                        <p className="font-medium">{form.watch("businessName") || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Industry</p>
                        <p className="font-medium">{form.watch("industry") || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Website Type</p>
                        <p className="font-medium">
                          {WEBSITE_TYPES.find((t) => t.value === form.watch("websiteType"))?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Pages</p>
                        <p className="font-medium">{form.watch("numberOfPages")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Features</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedFeatures.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Your Budget</p>
                        <p className="font-medium">${form.watch("budget")?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Cost</p>
                        <p className="font-bold text-lg text-blue-600">${estimatedCost.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep} className="ml-auto">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Project
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
