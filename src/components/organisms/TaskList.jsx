import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Checkbox from "@/components/atoms/Checkbox"
import ApperIcon from "@/components/ApperIcon"
import PriorityIndicator from "@/components/molecules/PriorityIndicator"
import StatusBadge from "@/components/molecules/StatusBadge"
import TaskForm from "@/components/organisms/TaskForm"
import { format } from "date-fns"

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleTaskComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed }
      await onTaskUpdate(updatedTask)
      toast.success(updatedTask.completed ? "Task completed!" : "Task reopened")
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await onTaskDelete(taskId)
        toast.success("Task deleted successfully")
      } catch (error) {
        toast.error("Failed to delete task")
      }
    }
  }

  const handleFormSubmit = async (taskData) => {
    try {
      await onTaskUpdate(taskData)
      setShowForm(false)
      setEditingTask(null)
      toast.success("Task updated successfully")
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const getTaskStatus = (task) => {
    if (task.completed) return "completed"
    if (task.dueDate && new Date(task.dueDate) < new Date()) return "overdue"
    return "pending"
  }

  const getCategoryColor = (category) => {
    const colors = {
      work: "bg-blue-100 text-blue-800",
      personal: "bg-green-100 text-green-800",
      health: "bg-purple-100 text-purple-800",
      shopping: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800"
    }
    return colors[category] || colors.other
  }

  if (tasks.length === 0) {
    return (
      <Card className="text-center py-12">
        <ApperIcon name="CheckSquare" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-600 mb-6">Create your first task to get started with your productivity journey.</p>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Your First Task
        </Button>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`transition-all duration-200 hover:shadow-card-hover ${
              task.completed ? "opacity-75" : ""
            }`}>
              <div className="flex items-start gap-4">
                <div className="pt-1">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleTaskComplete(task)}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-900 mb-2 ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className={`text-sm text-gray-600 mb-3 ${
                          task.completed ? "line-through" : ""
                        }`}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 flex-wrap">
                        <PriorityIndicator priority={task.priority} />
                        <StatusBadge status={getTaskStatus(task)} type="task" />
                        
                        {task.category && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                          </span>
                        )}

                        {task.dueDate && (
                          <div className="inline-flex items-center gap-1 text-sm text-gray-600">
                            <ApperIcon name="Calendar" className="h-4 w-4" />
                            {format(new Date(task.dueDate), "MMM d, yyyy")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(task)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task.Id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}
    </>
  )
}

export default TaskList