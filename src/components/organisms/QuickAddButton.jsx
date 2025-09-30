import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const QuickAddButton = ({ onAddTask, onAddNote, onAddMeeting }) => {
  const [isOpen, setIsOpen] = useState(false)

  const options = [
    { 
      label: "Task", 
      icon: "CheckSquare", 
      action: onAddTask,
      className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
    },
    { 
      label: "Note", 
      icon: "FileText", 
      action: onAddNote,
      className: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
    },
    { 
      label: "Meeting", 
      icon: "Calendar", 
      action: onAddMeeting,
      className: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
    }
  ]

  const handleOptionClick = (action) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {options.map((option, index) => (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleOptionClick(option.action)}
                  className={cn(
                    "flex items-center gap-2 text-white shadow-lg hover:shadow-xl transition-all duration-200",
                    option.className
                  )}
                >
                  <ApperIcon name={option.icon} className="h-4 w-4" />
                  Add {option.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-primary",
          isOpen && "rotate-45"
        )}
      >
        <ApperIcon name="Plus" className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}

export default QuickAddButton