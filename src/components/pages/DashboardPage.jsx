import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import PriorityIndicator from "@/components/molecules/PriorityIndicator"
import StatusBadge from "@/components/molecules/StatusBadge"
import QuickAddButton from "@/components/organisms/QuickAddButton"
import TaskForm from "@/components/organisms/TaskForm"
import NoteForm from "@/components/organisms/NoteForm"
import MeetingForm from "@/components/organisms/MeetingForm"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import taskService from "@/services/api/taskService"
import noteService from "@/services/api/noteService"
import meetingService from "@/services/api/meetingService"
import { format, isToday, isPast } from "date-fns"
import { toast } from "react-toastify"

const DashboardPage = () => {
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [showMeetingForm, setShowMeetingForm] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [tasksData, notesData, meetingsData] = await Promise.all([
        taskService.getAll(),
        noteService.getAll(),
        meetingService.getAll()
      ])
      setTasks(tasksData)
      setNotes(notesData)
      setMeetings(meetingsData)
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleTaskComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed }
      await taskService.update(task.Id, updatedTask)
      setTasks(prev => prev.map(t => t.Id === task.Id ? updatedTask : t))
      toast.success(updatedTask.completed ? "Task completed!" : "Task reopened")
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const handleTaskSubmit = async (taskData) => {
    try {
      let updatedTask
      if (taskData.Id && tasks.find(t => t.Id === taskData.Id)) {
        updatedTask = await taskService.update(taskData.Id, taskData)
        setTasks(prev => prev.map(t => t.Id === taskData.Id ? updatedTask : t))
      } else {
        updatedTask = await taskService.create(taskData)
        setTasks(prev => [...prev, updatedTask])
      }
      setShowTaskForm(false)
      toast.success("Task saved successfully")
    } catch (error) {
      toast.error("Failed to save task")
    }
  }

  const handleNoteSubmit = async (noteData) => {
    try {
      let updatedNote
      if (noteData.Id && notes.find(n => n.Id === noteData.Id)) {
        updatedNote = await noteService.update(noteData.Id, noteData)
        setNotes(prev => prev.map(n => n.Id === noteData.Id ? updatedNote : n))
      } else {
        updatedNote = await noteService.create(noteData)
        setNotes(prev => [...prev, updatedNote])
      }
      setShowNoteForm(false)
      toast.success("Note saved successfully")
    } catch (error) {
      toast.error("Failed to save note")
    }
  }

  const handleMeetingSubmit = async (meetingData) => {
    try {
      let updatedMeeting
      if (meetingData.Id && meetings.find(m => m.Id === meetingData.Id)) {
        updatedMeeting = await meetingService.update(meetingData.Id, meetingData)
        setMeetings(prev => prev.map(m => m.Id === meetingData.Id ? updatedMeeting : m))
      } else {
        updatedMeeting = await meetingService.create(meetingData)
        setMeetings(prev => [...prev, updatedMeeting])
      }
      setShowMeetingForm(false)
      toast.success("Meeting saved successfully")
    } catch (error) {
      toast.error("Failed to save meeting")
    }
  }

  // Filter today's items
  const todaysTasks = tasks.filter(task => {
    if (!task.dueDate) return !task.completed // Show incomplete tasks without due dates
    return isToday(new Date(task.dueDate))
  }).slice(0, 5)

  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 3)

  const todaysMeetings = meetings.filter(meeting => 
    isToday(new Date(meeting.datetime))
  )

  const upcomingMeetings = meetings.filter(meeting => 
    !isToday(new Date(meeting.datetime)) && !isPast(new Date(meeting.datetime))
  ).slice(0, 2)

  const allTodaysMeetings = [...todaysMeetings, ...upcomingMeetings].slice(0, 3)

  // Calculate stats
  const completedTasksToday = tasks.filter(task => 
    task.completed && task.dueDate && isToday(new Date(task.dueDate))
  ).length

  const totalTasksToday = tasks.filter(task => 
    task.dueDate && isToday(new Date(task.dueDate))
  ).length

  const upcomingMeetingsCount = meetings.filter(meeting => 
    meeting.status === "upcoming"
  ).length

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}!
          </h1>
          <p className="text-gray-600">
            Here's what's on your agenda for {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900">
                  {completedTasksToday}/{totalTasksToday}
                </h3>
                <p className="text-blue-700">Tasks Today</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="FileText" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-900">{notes.length}</h3>
                <p className="text-green-700">Total Notes</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-900">{upcomingMeetingsCount}</h3>
                <p className="text-purple-700">Upcoming Meetings</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="CheckSquare" className="h-5 w-5 text-blue-500" />
                Today's Tasks
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTaskForm(true)}
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
              </Button>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">All caught up for today! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysTasks.map((task, index) => (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <button
                      onClick={() => handleTaskComplete(task)}
                      className={`mt-0.5 w-4 h-4 rounded border-2 transition-colors ${
                        task.completed 
                          ? "bg-blue-500 border-blue-500" 
                          : "border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      {task.completed && (
                        <ApperIcon name="Check" className="h-3 w-3 text-white" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <PriorityIndicator priority={task.priority} />
                        {task.category && (
                          <span className="text-xs text-gray-500 capitalize">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Notes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="FileText" className="h-5 w-5 text-green-500" />
                Recent Notes
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNoteForm(true)}
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
              </Button>
            </div>

            {recentNotes.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No notes yet. Create your first note!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentNotes.map((note, index) => (
                  <motion.div
                    key={note.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{note.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {format(new Date(note.updatedAt || note.createdAt), "MMM d")}
                      </div>
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex gap-1">
                          {note.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Meetings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ApperIcon name="Calendar" className="h-5 w-5 text-purple-500" />
              Upcoming Meetings
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMeetingForm(true)}
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
            </Button>
          </div>

          {allTodaysMeetings.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No meetings scheduled. Enjoy your free time!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allTodaysMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.Id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Calendar" className="h-6 w-6 text-purple-500" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                    <p className="text-sm text-gray-600">
                      {format(new Date(meeting.datetime), "h:mm a")}
                      {meeting.participants && meeting.participants.length > 0 && (
                        <span className="ml-2">
                          • {meeting.participants.length} participant{meeting.participants.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <StatusBadge status={meeting.status} type="meeting" />
                    {isToday(new Date(meeting.datetime)) && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Today
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Quick Add Button */}
      <QuickAddButton
        onAddTask={() => setShowTaskForm(true)}
        onAddNote={() => setShowNoteForm(true)}
        onAddMeeting={() => setShowMeetingForm(true)}
      />

      {/* Forms */}
      {showTaskForm && (
        <TaskForm
          onSubmit={handleTaskSubmit}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {showNoteForm && (
        <NoteForm
          onSubmit={handleNoteSubmit}
          onCancel={() => setShowNoteForm(false)}
        />
      )}

      {showMeetingForm && (
        <MeetingForm
          onSubmit={handleMeetingSubmit}
          onCancel={() => setShowMeetingForm(false)}
        />
      )}
    </div>
  )
}

export default DashboardPage