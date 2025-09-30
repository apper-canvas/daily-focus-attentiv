import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import MeetingList from "@/components/organisms/MeetingList"
import MeetingForm from "@/components/organisms/MeetingForm"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import meetingService from "@/services/api/meetingService"
import { isSameDay, isPast, isFuture } from "date-fns"

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([])
  const [filteredMeetings, setFilteredMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDate, setFilterDate] = useState("")

  const loadMeetings = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await meetingService.getAll()
      setMeetings(data)
      setFilteredMeetings(data)
    } catch (err) {
      setError("Failed to load meetings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMeetings()
  }, [])

  useEffect(() => {
    let filtered = meetings

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (meeting.agenda && meeting.agenda.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (meeting.participants && meeting.participants.some(p => 
          p.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter(meeting => meeting.status === filterStatus)
    }

    // Date filter
    if (filterDate) {
      const today = new Date()
      const filterDateTime = new Date(filterDate)
      
      if (filterDate === "today") {
        filtered = filtered.filter(meeting => 
          isSameDay(new Date(meeting.datetime), today)
        )
      } else if (filterDate === "upcoming") {
        filtered = filtered.filter(meeting => 
          isFuture(new Date(meeting.datetime))
        )
      } else if (filterDate === "past") {
        filtered = filtered.filter(meeting => 
          isPast(new Date(meeting.datetime))
        )
      } else {
        filtered = filtered.filter(meeting => 
          isSameDay(new Date(meeting.datetime), filterDateTime)
        )
      }
    }

    // Sort by datetime
    filtered.sort((a, b) => new Date(a.datetime) - new Date(b.datetime))

    setFilteredMeetings(filtered)
  }, [meetings, searchQuery, filterStatus, filterDate])

  const handleMeetingUpdate = async (meetingData) => {
    try {
      let updatedMeeting
      if (meetingData.Id && meetings.find(m => m.Id === meetingData.Id)) {
        updatedMeeting = await meetingService.update(meetingData.Id, meetingData)
        setMeetings(prev => prev.map(m => m.Id === meetingData.Id ? updatedMeeting : m))
      } else {
        updatedMeeting = await meetingService.create(meetingData)
        setMeetings(prev => [...prev, updatedMeeting])
      }
    } catch (error) {
      throw new Error("Failed to save meeting")
    }
  }

  const handleMeetingDelete = async (meetingId) => {
    try {
      await meetingService.delete(meetingId)
      setMeetings(prev => prev.filter(m => m.Id !== meetingId))
    } catch (error) {
      throw new Error("Failed to delete meeting")
    }
  }

  const handleFormSubmit = async (meetingData) => {
    await handleMeetingUpdate(meetingData)
    setShowForm(false)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterStatus("")
    setFilterDate("")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadMeetings} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage your meetings
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          {(searchQuery || filterStatus || filterDate) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <ApperIcon name="X" className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search meetings..."
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Future</option>
            <option value="past">Past</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {filteredMeetings.length} of {meetings.length} meetings
          </div>
        </div>
      </div>

      {/* Meeting List */}
      <MeetingList
        meetings={filteredMeetings}
        onMeetingUpdate={handleMeetingUpdate}
        onMeetingDelete={handleMeetingDelete}
      />

      {/* Meeting Form */}
      {showForm && (
        <MeetingForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default MeetingsPage