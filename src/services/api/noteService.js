import mockNotes from "@/services/mockData/notes.json"

let notes = [...mockNotes]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const noteService = {
  async getAll() {
    await delay(300)
    return [...notes]
  },

  async getById(id) {
    await delay(200)
    const note = notes.find(n => n.Id === parseInt(id))
    if (!note) {
      throw new Error("Note not found")
    }
    return { ...note }
  },

  async create(noteData) {
    await delay(400)
    const newId = Math.max(...notes.map(n => n.Id), 0) + 1
    const newNote = {
      ...noteData,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    notes.unshift(newNote)
    return { ...newNote }
  },

  async update(id, noteData) {
    await delay(300)
    const index = notes.findIndex(n => n.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Note not found")
    }
    notes[index] = { 
      ...noteData, 
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    }
    return { ...notes[index] }
  },

  async delete(id) {
    await delay(250)
    const index = notes.findIndex(n => n.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Note not found")
    }
    notes.splice(index, 1)
    return true
  }
}

export default noteService