import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Users, DollarSign, FileText, TrendingUp, Search, Filter } from "lucide-react"
import { UpdateStatusForm } from "../../components/update-status-form"
import { DeleteProjectButton } from "@/components/delete-project-button"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react"

async function getAllProjects() {
  return await prisma.projectForm.findMany({
    include: {
      user: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

async function requireAdmin() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  // For demo purposes, allow any authenticated user to access admin
  // In production, check user.role === "ADMIN"
  if (!user) {
    redirect("/sign-in")
  }

  return user
}

export default async function AdminPage() {
  await requireAdmin()
  const projects = await getAllProjects()

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

  type Payment = { status: string; amount: number }
  type Project = { payments: Payment[] }

  const totalRevenue = projects.reduce((sum: number, project: Project) => {
    const paidAmount = project.payments
      .filter((p) => p.status === "PAID")
      .reduce((s, p) => s + p.amount, 0)
    return sum + paidAmount
  }, 0)

  const completedProjects = projects.filter((p: { status: string }) => p.status === "COMPLETED").length
  const activeProjects = projects.filter((p: { status: string }) => p.status === "IN_PROGRESS").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-600">Manage all client projects and submissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Data</Button>
            <Button>Generate Report</Button>
          </div>
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
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold">{activeProjects}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{completedProjects}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search projects..." className="pl-10" />
                </div>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <div className="grid gap-6">
          {projects.map((project: { id: unknown[] | Key | null | undefined; businessName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; user: { email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }; createdAt: string | number | Date; status: string; websiteType: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; numberOfPages: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; budget: { toLocaleString: () => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }; deadline: string | number | Date; payments: string | unknown[]; features: unknown[] }) => (
            <Card key={Array.isArray(project.id) ? project.id.join("-") : project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {project.businessName}
                      <Badge variant="outline" className="text-xs">
                        #{project.id ? String(project.id).slice(-8) : "N/A"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {project.user.email} • Created {new Date(project.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Type & Pages</p>
                    <p className="font-medium">
                      {project.websiteType} • {project.numberOfPages} pages
                    </p>
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
                    <p className="font-medium">
                      {(project.payments as { status: string }[]).length > 0
                        ? (project.payments as { status: string }[])[0].status
                        : "No Payment"}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Features</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.features.map((feature) => (
                      <Badge key={String(feature)} variant="secondary" className="text-xs">
                        {String(feature)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <UpdateStatusForm
                    projectId={
                      Array.isArray(project.id)
                        ? project.id.join("-")
                        : project.id !== undefined && project.id !== null
                        ? String(project.id)
                        : ""
                    }
                    currentStatus={project.status}
                  />
                  <Button variant="outline" size="sm">
                    Contact Client
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <DeleteProjectButton
                    projectId={
                      Array.isArray(project.id)
                        ? project.id.join("-")
                        : project.id !== undefined && project.id !== null
                        ? String(project.id)
                        : ""
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
