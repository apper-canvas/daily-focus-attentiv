import React from "react"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  error, 
  children, 
  required = false,
  className 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default FormField