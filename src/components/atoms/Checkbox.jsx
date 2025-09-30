import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = React.forwardRef(({ className, checked, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        className={cn(
          "h-4 w-4 rounded border-2 border-gray-300 bg-white checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors",
          className
        )}
        {...props}
      />
      {checked && (
        <ApperIcon
          name="Check"
          className="absolute top-0 left-0 h-4 w-4 text-white pointer-events-none"
        />
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox