import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, Clock, AlertCircle, XCircle, FileText, CreditCard } from "lucide-react"

interface StatusBadgeProps {
  status: string
  type?: "project" | "payment"
  className?: string
  showIcon?: boolean
  size?: "sm" | "default"
}

export function StatusBadge({
  status,
  type = "project",
  className,
  showIcon = true,
  size = "default",
}: StatusBadgeProps) {
  const getStatusConfig = (status: string, type: string) => {
    if (type === "payment") {
      switch (status) {
        case "PAID":
          return {
            variant: "default" as const,
            className: "bg-green-100 text-green-800 hover:bg-green-200",
            icon: CheckCircle,
            label: "Paid",
          }
        case "PENDING":
          return {
            variant: "secondary" as const,
            className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
            icon: Clock,
            label: "Pending",
          }
        case "FAILED":
          return {
            variant: "destructive" as const,
            className: "bg-red-100 text-red-800 hover:bg-red-200",
            icon: XCircle,
            label: "Failed",
          }
        case "PARTIAL":
          return {
            variant: "secondary" as const,
            className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
            icon: AlertCircle,
            label: "Partial",
          }
        default:
          return {
            variant: "outline" as const,
            className: "bg-gray-100 text-gray-800",
            icon: CreditCard,
            label: status,
          }
      }
    }

    // Project status
    switch (status) {
      case "DRAFT":
        return {
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-800",
          icon: FileText,
          label: "Draft",
        }
      case "SUBMITTED":
        return {
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
          icon: Clock,
          label: "Submitted",
        }
      case "IN_PROGRESS":
        return {
          variant: "default" as const,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
          icon: AlertCircle,
          label: "In Progress",
        }
      case "COMPLETED":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-200",
          icon: CheckCircle,
          label: "Completed",
        }
      case "CANCELLED":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 hover:bg-red-200",
          icon: XCircle,
          label: "Cancelled",
        }
      default:
        return {
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-800",
          icon: FileText,
          label: status.replace("_", " "),
        }
    }
  }

  const config = getStatusConfig(status, type)
  const Icon = config.icon

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "flex items-center gap-1 font-medium transition-colors",
        size === "sm" ? "text-xs px-2 py-0.5" : "",
        config.className,
        className,
      )}
    >
      {showIcon && <Icon className={cn("h-3 w-3", size === "sm" ? "h-2.5 w-2.5" : "")} />}
      {config.label}
    </Badge>
  )
}
