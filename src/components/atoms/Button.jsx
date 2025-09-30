import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
  
  const variants = {
    default: "bg-gradient-to-r from-primary to-indigo-600 text-white hover:from-indigo-600 hover:to-primary shadow-md hover:shadow-lg",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-primary",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-error shadow-md hover:shadow-lg"
  }
  
  const sizes = {
    sm: "h-9 px-3 text-xs",
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button