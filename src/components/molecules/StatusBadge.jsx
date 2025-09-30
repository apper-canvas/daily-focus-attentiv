import React from "react"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const StatusBadge = ({ status, type = "task" }) => {
  const getStatusConfig = () => {
    if (type === "task") {
      switch (status) {
        case "completed":
          return { variant: "success", icon: "CheckCircle", text: "Completed" }
        case "pending":
          return { variant: "warning", icon: "Clock", text: "Pending" }
        case "overdue":
          return { variant: "error", icon: "AlertCircle", text: "Overdue" }
        default:
          return { variant: "default", icon: "Circle", text: "Open" }
      }
    } else if (type === "meeting") {
      switch (status) {
        case "upcoming":
          return { variant: "primary", icon: "Calendar", text: "Upcoming" }
        case "in-progress":
          return { variant: "warning", icon: "Play", text: "In Progress" }
        case "completed":
          return { variant: "success", icon: "CheckCircle", text: "Completed" }
        case "cancelled":
          return { variant: "error", icon: "X", text: "Cancelled" }
        default:
          return { variant: "default", icon: "Calendar", text: "Scheduled" }
      }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge variant={config.variant} className="inline-flex items-center gap-1">
      <ApperIcon name={config.icon} className="h-3 w-3" />
      {config.text}
    </Badge>
  )
}

export default StatusBadge