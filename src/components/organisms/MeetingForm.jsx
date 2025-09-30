import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"

const MeetingForm = ({ meeting, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    datetime: "",
    duration: 60,
    participants: [],
    agenda: "",
    status: "upcoming"
  })

  const [participantInput, setParticipantInput] = useState("")
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (meeting) {
      setFormData({
        ...meeting,
        datetime: new Date(meeting.datetime).toISOString().slice(0, 16)
      })
    }
  }, [meeting])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleAddParticipant = () => {
    const participant = participantInput.trim()
    if (participant && !formData.participants.includes(participant)) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, participant]
      }))
      setParticipantInput("")
    }
  }

  const handleRemoveParticipant = (participantToRemove) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== participantToRemove)
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddParticipant()
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (!formData.datetime) {
      newErrors.datetime = "Date and time are required"
    } else if (new Date(formData.datetime) < new Date()) {
      newErrors.datetime = "Meeting cannot be scheduled in the past"
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const meetingData = {
      ...formData,
      Id: meeting?.Id || Date.now(),
      datetime: new Date(formData.datetime).toISOString(),
      duration: Number(formData.duration),
      createdAt: meeting?.createdAt || new Date().toISOString()
    }

    onSubmit(meetingData)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {meeting ? "Edit Meeting" : "Schedule Meeting"}
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onCancel}
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>

            <FormField label="Meeting Title" required error={errors.title}>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter meeting title"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Date & Time" required error={errors.datetime}>
                <Input
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={(e) => handleChange("datetime", e.target.value)}
                />
              </FormField>

              <FormField label="Duration (minutes)" required error={errors.duration}>
                <Input
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  placeholder="60"
                />
              </FormField>
            </div>

            <FormField label="Participants">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={participantInput}
                    onChange={(e) => setParticipantInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add participant email or name..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddParticipant}
                    disabled={!participantInput.trim()}
                  >
                    <ApperIcon name="Plus" className="h-4 w-4" />
                  </Button>
                </div>

                {formData.participants.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.participants.map((participant, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-sm"
                      >
                        {participant}
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(participant)}
                          className="text-primary hover:text-primary/70"
                        >
                          <ApperIcon name="X" className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormField>

            <FormField label="Agenda">
              <Textarea
                value={formData.agenda}
                onChange={(e) => handleChange("agenda", e.target.value)}
                placeholder="Meeting agenda and notes (optional)"
                rows={4}
              />
            </FormField>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {meeting ? "Update Meeting" : "Schedule Meeting"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default MeetingForm