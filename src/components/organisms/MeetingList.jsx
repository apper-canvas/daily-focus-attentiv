import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import StatusBadge from "@/components/molecules/StatusBadge"
import MeetingForm from "@/components/organisms/MeetingForm"
import { format } from "date-fns"

const MeetingList = ({ meetings, onMeetingUpdate, onMeetingDelete }) => {
  const [editingMeeting, setEditingMeeting] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting)
    setShowForm(true)
  }

  const handleDelete = async (meetingId) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      try {
        await onMeetingDelete(meetingId)
        toast.success("Meeting deleted successfully")
      } catch (error) {
        toast.error("Failed to delete meeting")
      }
    }
  }

  const handleStatusUpdate = async (meeting, newStatus) => {
    try {
      const updatedMeeting = { ...meeting, status: newStatus }
      await onMeetingUpdate(updatedMeeting)
      toast.success(`Meeting marked as ${newStatus}`)
    } catch (error) {
      toast.error("Failed to update meeting status")
    }
  }

  const handleFormSubmit = async (meetingData) => {
    try {
      await onMeetingUpdate(meetingData)
      setShowForm(false)
      setEditingMeeting(null)
      toast.success(editingMeeting ? "Meeting updated successfully" : "Meeting created successfully")
    } catch (error) {
      toast.error("Failed to save meeting")
    }
  }

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  if (meetings.length === 0) {
    return (
      <Card className="text-center py-12">
        <ApperIcon name="Calendar" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings scheduled</h3>
        <p className="text-gray-600 mb-6">Schedule your first meeting to keep track of your appointments.</p>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Schedule Your First Meeting
        </Button>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {meetings.map((meeting, index) => (
          <motion.div
            key={meeting.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <ApperIcon name="Calendar" className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Clock" className="h-4 w-4" />
                          {format(new Date(meeting.datetime), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Timer" className="h-4 w-4" />
                          {formatDuration(meeting.duration)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {meeting.participants && meeting.participants.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <ApperIcon name="Users" className="h-4 w-4 text-gray-500" />
                      <div className="flex flex-wrap gap-1">
                        {meeting.participants.slice(0, 3).map((participant, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {participant}
                          </Badge>
                        ))}
                        {meeting.participants.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{meeting.participants.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {meeting.agenda && (
                    <p className="text-sm text-gray-600 mb-3 pl-7">
                      {meeting.agenda}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pl-7">
                    <StatusBadge status={meeting.status} type="meeting" />
                    
                    {meeting.status === "upcoming" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(meeting, "in-progress")}
                        >
                          Start Meeting
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(meeting, "cancelled")}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {meeting.status === "in-progress" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(meeting, "completed")}
                      >
                        End Meeting
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(meeting)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(meeting.Id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {showForm && (
        <MeetingForm
          meeting={editingMeeting}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingMeeting(null)
          }}
        />
      )}
    </>
  )
}

export default MeetingList