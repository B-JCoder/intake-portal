"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { intakeFormSchema, type IntakeFormFullData } from "@/lib/validations"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Plus, Trash2 } from "lucide-react"

interface IntakeFormProps {
  onSubmit: (data: IntakeFormFullData) => Promise<void>
  isLoading?: boolean
}

export function IntakeForm({ onSubmit, isLoading = false }: IntakeFormProps) {
  const [requirements, setRequirements] = useState<string[]>([""])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IntakeFormFullData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      client: {
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        phone: "",
      },
      intake: {
        projectName: "",
        projectType: "WEB_DEVELOPMENT",
        budget: 1000,
        timeline: "",
        description: "",
        requirements: [""],
        priority: "MEDIUM",
      },
    },
  })

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements]
    newRequirements[index] = value
    setRequirements(newRequirements)
    setValue(
      "intake.requirements",
      newRequirements.filter((req) => req.trim() !== ""),
    )
  }

  const addRequirement = () => {
    setRequirements([...requirements, ""])
  }

  const removeRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index)
    setRequirements(newRequirements)
    setValue(
      "intake.requirements",
      newRequirements.filter((req) => req.trim() !== ""),
    )
  }

  const onFormSubmit = async (data: IntakeFormFullData) => {
    const filteredData = {
      ...data,
      intake: {
        ...data.intake,
        requirements: data.intake.requirements.filter((req) => req.trim() !== ""),
      },
    }
    await onSubmit(filteredData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Submitting your project..." />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Please provide your contact details so we can reach out to you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register("client.firstName")}
                placeholder="John"
                aria-invalid={!!errors.client?.firstName}
              />
              {errors.client?.firstName && <p className="text-sm text-red-600">{errors.client.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register("client.lastName")}
                placeholder="Doe"
                aria-invalid={!!errors.client?.lastName}
              />
              {errors.client?.lastName && <p className="text-sm text-red-600">{errors.client.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register("client.email")}
              placeholder="john@example.com"
              aria-invalid={!!errors.client?.email}
            />
            {errors.client?.email && <p className="text-sm text-red-600">{errors.client.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input id="company" {...register("client.company")} placeholder="Acme Inc." />
              {errors.client?.company && <p className="text-sm text-red-600">{errors.client.company.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input id="phone" type="tel" {...register("client.phone")} placeholder="+1 (555) 123-4567" />
              {errors.client?.phone && <p className="text-sm text-red-600">{errors.client.phone.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Tell us about your project so we can provide the best solution.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              {...register("intake.projectName")}
              placeholder="My Awesome Project"
              aria-invalid={!!errors.intake?.projectName}
            />
            {errors.intake?.projectName && <p className="text-sm text-red-600">{errors.intake.projectName.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type *</Label>
              <Select
                onValueChange={(value) => setValue("intake.projectType", value as unknown)}
                defaultValue="WEB_DEVELOPMENT"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEB_DEVELOPMENT">Web Development</SelectItem>
                  <SelectItem value="MOBILE_APP">Mobile App</SelectItem>
                  <SelectItem value="DESIGN">Design</SelectItem>
                  <SelectItem value="CONSULTING">Consulting</SelectItem>
                  <SelectItem value="MARKETING">Marketing</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.intake?.projectType && (
                <p className="text-sm text-red-600">{errors.intake.projectType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => setValue("intake.priority", value as unknown)} defaultValue="MEDIUM">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD) *</Label>
              <Input
                id="budget"
                type="number"
                min="100"
                max="1000000"
                step="100"
                {...register("intake.budget", { valueAsNumber: true })}
                placeholder="5000"
                aria-invalid={!!errors.intake?.budget}
              />
              {errors.intake?.budget && <p className="text-sm text-red-600">{errors.intake.budget.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline *</Label>
              <Input
                id="timeline"
                {...register("intake.timeline")}
                placeholder="e.g., 2-3 months"
                aria-invalid={!!errors.intake?.timeline}
              />
              {errors.intake?.timeline && <p className="text-sm text-red-600">{errors.intake.timeline.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              {...register("intake.description")}
              placeholder="Describe your project in detail..."
              rows={4}
              aria-invalid={!!errors.intake?.description}
            />
            {errors.intake?.description && <p className="text-sm text-red-600">{errors.intake.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Project Requirements *</Label>
            <div className="space-y-2">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    className="flex-1"
                  />
                  {requirements.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeRequirement(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addRequirement} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </div>
            {errors.intake?.requirements && (
              <p className="text-sm text-red-600">{errors.intake.requirements.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Project Intake"
          )}
        </Button>
      </div>
    </form>
  )
}
