import React from "react"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "Nothing here yet",
  message = "Get started by adding your first item",
  icon = "Inbox",
  actionLabel = "Get Started",
  onAction
}) => {
  return (
    <Card className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onAction && (
          <Button onClick={onAction} className="inline-flex items-center gap-2">
            <ApperIcon name="Plus" className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default Empty