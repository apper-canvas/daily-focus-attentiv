import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import TaskList from "@/components/organisms/TaskList"
import TaskForm from "@/components/organisms/TaskForm"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import taskService from "@/services/api/taskService"

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await taskService.getAll()
      setTasks(data)
      setFilteredTasks(data)
    } catch (err) {
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    let filtered = tasks

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Priority filter
    if (filterPriority) {
      filtered = filtered.filter(task => task.priority === filterPriority)
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter(task => task.category === filterCategory)
    }

    // Status filter
    if (filterStatus) {
      if (filterStatus === "completed") {
        filtered = filtered.filter(task => task.completed)
      } else if (filterStatus === "pending") {
        filtered = filtered.filter(task => !task.completed)
      } else if (filterStatus === "overdue") {
        filtered = filtered.filter(task => 
          !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
        )
      }
    }

    // Sort by priority and due date
    filtered.sort((a, b) => {
      // Priority order: high, medium, low
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      
      if (priorityDiff !== 0) return priorityDiff
      
      // Then by due date
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    })

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, filterPriority, filterCategory, filterStatus])

  const handleTaskUpdate = async (taskData) => {
    try {
      let updatedTask
      if (taskData.Id && tasks.find(t => t.Id === taskData.Id)) {
        updatedTask = await taskService.update(taskData.Id, taskData)
        setTasks(prev => prev.map(t => t.Id === taskData.Id ? updatedTask : t))
      } else {
        updatedTask = await taskService.create(taskData)
        setTasks(prev => [...prev, updatedTask])
      }
    } catch (error) {
      throw new Error("Failed to save task")
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.Id !== taskId))
    } catch (error) {
      throw new Error("Failed to delete task")
    }
  }

  const handleFormSubmit = async (taskData) => {
    await handleTaskUpdate(taskData)
    setShowForm(false)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterPriority("")
    setFilterCategory("")
    setFilterStatus("")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTasks} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your tasks and stay organized
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          {(searchQuery || filterPriority || filterCategory || filterStatus) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <ApperIcon name="X" className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tasks..."
          />

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>
      </div>

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />

      {/* Task Form */}
      {showForm && (
        <TaskForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default TasksPage