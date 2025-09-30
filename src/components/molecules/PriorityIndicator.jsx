import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const PriorityIndicator = ({ priority, size = "sm" }) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case "high":
        return { 
          color: "text-red-500", 
          bg: "bg-red-100", 
          icon: "AlertCircle",
          text: "High Priority"
        }
      case "medium":
        return { 
          color: "text-yellow-500", 
          bg: "bg-yellow-100", 
          icon: "Clock",
          text: "Medium Priority" 
        }
      case "low":
        return { 
          color: "text-green-500", 
          bg: "bg-green-100", 
          icon: "Minus",
          text: "Low Priority"
        }
      default:
        return { 
          color: "text-gray-400", 
          bg: "bg-gray-100", 
          icon: "Circle",
          text: "No Priority"
        }
    }
  }

  const config = getPriorityConfig()
  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4"

  return (
    <div className={cn("inline-flex items-center gap-1", size === "lg" && "px-2 py-1 rounded-full", config.bg)}>
      <ApperIcon 
        name={config.icon} 
        className={cn(iconSize, config.color)}
      />
      {size === "lg" && (
        <span className={cn("text-sm font-medium", config.color)}>
          {config.text}
        </span>
      )}
    </div>
  )
}

export default PriorityIndicator