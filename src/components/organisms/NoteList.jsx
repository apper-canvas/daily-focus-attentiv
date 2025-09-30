import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import NoteForm from "@/components/organisms/NoteForm"
import { format } from "date-fns"

const NoteList = ({ notes, onNoteUpdate, onNoteDelete }) => {
  const [editingNote, setEditingNote] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleEdit = (note) => {
    setEditingNote(note)
    setShowForm(true)
  }

  const handleDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await onNoteDelete(noteId)
        toast.success("Note deleted successfully")
      } catch (error) {
        toast.error("Failed to delete note")
      }
    }
  }

  const handleFormSubmit = async (noteData) => {
    try {
      await onNoteUpdate(noteData)
      setShowForm(false)
      setEditingNote(null)
      toast.success(editingNote ? "Note updated successfully" : "Note created successfully")
    } catch (error) {
      toast.error("Failed to save note")
    }
  }

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  if (notes.length === 0) {
    return (
      <Card className="text-center py-12">
        <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
        <p className="text-gray-600 mb-6">Start capturing your thoughts and ideas with your first note.</p>
        <Button onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Your First Note
        </Button>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note, index) => (
          <motion.div
            key={note.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-card-hover cursor-pointer">
              <div className="flex-1" onClick={() => handleEdit(note)}>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {note.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                  {truncateContent(note.content)}
                </p>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{note.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {format(new Date(note.updatedAt || note.createdAt), "MMM d, yyyy")}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(note)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(note.Id)
                    }}
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
        <NoteForm
          note={editingNote}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingNote(null)
          }}
        />
      )}
    </>
  )
}

export default NoteList