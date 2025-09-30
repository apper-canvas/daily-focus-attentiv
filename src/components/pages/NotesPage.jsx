import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import NoteList from "@/components/organisms/NoteList"
import NoteForm from "@/components/organisms/NoteForm"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import noteService from "@/services/api/noteService"

const NotesPage = () => {
  const [notes, setNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  const loadNotes = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await noteService.getAll()
      setNotes(data)
      setFilteredNotes(data)
    } catch (err) {
      setError("Failed to load notes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  useEffect(() => {
    let filtered = notes

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(note =>
        note.tags && note.tags.includes(selectedTag)
      )
    }

    // Sort by updated date
    filtered.sort((a, b) => 
      new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    )

    setFilteredNotes(filtered)
  }, [notes, searchQuery, selectedTag])

  const handleNoteUpdate = async (noteData) => {
    try {
      let updatedNote
      if (noteData.Id && notes.find(n => n.Id === noteData.Id)) {
        updatedNote = await noteService.update(noteData.Id, noteData)
        setNotes(prev => prev.map(n => n.Id === noteData.Id ? updatedNote : n))
      } else {
        updatedNote = await noteService.create(noteData)
        setNotes(prev => [...prev, updatedNote])
      }
    } catch (error) {
      throw new Error("Failed to save note")
    }
  }

  const handleNoteDelete = async (noteId) => {
    try {
      await noteService.delete(noteId)
      setNotes(prev => prev.filter(n => n.Id !== noteId))
    } catch (error) {
      throw new Error("Failed to delete note")
    }
  }

  const handleFormSubmit = async (noteData) => {
    await handleNoteUpdate(noteData)
    setShowForm(false)
  }

  // Get all unique tags
  const allTags = [...new Set(
    notes.flatMap(note => note.tags || [])
  )].sort()

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTag("")
  }

  if (loading) return <Loading type="grid" />
  if (error) return <Error message={error} onRetry={loadNotes} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-600 mt-1">
            Capture your thoughts and ideas
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          {(searchQuery || selectedTag) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <ApperIcon name="X" className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search notes, content, or tags..."
            />
          </div>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          {filteredNotes.length} of {notes.length} notes
        </div>
      </div>

      {/* Notes List */}
      <NoteList
        notes={filteredNotes}
        onNoteUpdate={handleNoteUpdate}
        onNoteDelete={handleNoteDelete}
      />

      {/* Note Form */}
      {showForm && (
        <NoteForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default NotesPage