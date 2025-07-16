import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, FileText, CreditCard, Calendar, DollarSign, Eye, Download } from "lucide-react"
import { DeleteProjectButton } from "@/components/delete-project-button"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react"

async function getProjects(userId: string) {
  return await prisma.projectForm.findMany({
    where: { userId },
    include: { payments: true },
    orderBy: { createdAt: "desc" },
  })
}

async function getOrCreateUser(clerkId: string, email: string) {
  const user = await prisma.user.upsert({
    where: { email },
    update: { clerkId },
    create: {
      email,
      clerkId,
    },
  })
  return user
}

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get user from Clerk and create/update in database
  const user = await getOrCreateUser(userId, "user@example.com") // In real app, get email from Clerk
  const projects = await getProjects(user.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800"
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600"
      case "PENDING":
        return "text-yellow-600"
      case "FAILED":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const totalSpent = projects.reduce((sum: number, project: { payments: { status: string; amount: number }[] }) => {
    const paidAmount = project.payments
      .filter((p) => p.status === "PAID")
      .reduce((s: number, p: { amount: number }) => s + p.amount, 0)
    return sum + paidAmount
  }, 0)

  const inProgressCount = projects.filter((p: { status: string }) => p.status === "IN_PROGRESS").length
  const completedCount = projects.filter((p: { status: string }) => p.status === "COMPLETED").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Manage your projects and track progress</p>
          </div>
          <Link href="/submit">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold">{inProgressCount}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{completedCount}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div className="grid gap-6">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">Get started by submitting your first project</p>
                <Link href="/submit">
                  <Button>Submit Project</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            projects.map((project: { id: Key | null | undefined; businessName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; websiteType: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; numberOfPages: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; createdAt: string | number | Date; status: string; features: unknown[]; budget: { toLocaleString: () => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }; deadline: string | number | Date; payments: { status?: string; amount?: number }[] }) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {project.businessName}
                        <Badge variant="outline" className="text-xs">
                          #{String(project.id).slice(-8)}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {project.websiteType} • {project.numberOfPages} pages • Created{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Features</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.features.slice(0, 2).map((feature) => (
                          <Badge key={String(feature)} variant="secondary" className="text-xs">
                            {String(feature)}
                          </Badge>
                        ))}
                        {project.features.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.features.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-medium text-lg">${project.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Deadline</p>
                      <p className="font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span
                          className={`font-medium ${getPaymentStatusColor(project.payments[0]?.status || "PENDING")}`}
                        >
                          {project.payments[0] && typeof project.payments[0].status === "string"
                            ? project.payments[0].status
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {project.status === "SUBMITTED" && !project.payments.some((p) => p.status === "PAID") && (
                      <Link href={`/payment?projectId=${project.id}`}>
                        <Button size="sm">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Make Payment
                        </Button>
                      </Link>
                    )}
                    {project.status === "COMPLETED" && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                    )}
                    <DeleteProjectButton projectId={project.id ? String(project.id) : ""} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
