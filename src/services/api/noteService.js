const noteService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      }

      const response = await apperClient.fetchRecords('note_c', params)
      
      if (!response?.success) {
        console.error("Error fetching notes:", response?.message || "Unknown error")
        return []
      }

      return response.data?.map(note => ({
        Id: note.Id,
        title: note.title_c || note.Name,
        content: note.content_c || "",
        tags: note.tags_c ? (typeof note.tags_c === 'string' ? note.tags_c.split(',').map(t => t.trim()) : note.tags_c) : [],
        createdAt: note.created_at_c || note.CreatedOn,
        updatedAt: note.updated_at_c || note.ModifiedOn
      })) || []
    } catch (error) {
      console.error("Error fetching notes:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      }

      const response = await apperClient.getRecordById('note_c', parseInt(id), params)
      
      if (!response?.data) {
        return null
      }

      const note = response.data
      return {
        Id: note.Id,
        title: note.title_c || note.Name,
        content: note.content_c || "",
        tags: note.tags_c ? (typeof note.tags_c === 'string' ? note.tags_c.split(',').map(t => t.trim()) : note.tags_c) : [],
        createdAt: note.created_at_c || note.CreatedOn,
        updatedAt: note.updated_at_c || note.ModifiedOn
      }
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(noteData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const createData = {
        Name: noteData.title,
        title_c: noteData.title,
        content_c: noteData.content || "",
        tags_c: Array.isArray(noteData.tags) ? noteData.tags.join(',') : (noteData.tags || ""),
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
      }

      const params = {
        records: [createData]
      }

      const response = await apperClient.createRecord('note_c', params)

      if (!response.success) {
        console.error("Error creating note:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} notes:`, failed)
          throw new Error("Failed to create note")
        }
        
        if (successful.length > 0) {
          const created = successful[0].data
          return {
            Id: created.Id,
            title: created.title_c || created.Name,
            content: created.content_c || "",
            tags: created.tags_c ? (typeof created.tags_c === 'string' ? created.tags_c.split(',').map(t => t.trim()) : created.tags_c) : [],
            createdAt: created.created_at_c || created.CreatedOn,
            updatedAt: created.updated_at_c || created.ModifiedOn
          }
        }
      }
      
      throw new Error("No successful results returned")
    } catch (error) {
      console.error("Error creating note:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, noteData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const updateData = {
        Id: parseInt(id),
        Name: noteData.title,
        title_c: noteData.title,
        content_c: noteData.content || "",
        tags_c: Array.isArray(noteData.tags) ? noteData.tags.join(',') : (noteData.tags || ""),
        updated_at_c: new Date().toISOString()
      }

      const params = {
        records: [updateData]
      }

      const response = await apperClient.updateRecord('note_c', params)

      if (!response.success) {
        console.error("Error updating note:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} notes:`, failed)
          throw new Error("Failed to update note")
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data
          return {
            Id: updated.Id,
            title: updated.title_c || updated.Name,
            content: updated.content_c || "",
            tags: updated.tags_c ? (typeof updated.tags_c === 'string' ? updated.tags_c.split(',').map(t => t.trim()) : updated.tags_c) : [],
            createdAt: updated.created_at_c || updated.CreatedOn,
            updatedAt: updated.updated_at_c || updated.ModifiedOn
          }
        }
      }
      
      throw new Error("No successful results returned")
    } catch (error) {
      console.error("Error updating note:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = { 
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('note_c', params)

      if (!response.success) {
        console.error("Error deleting note:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} notes:`, failed)
          throw new Error("Failed to delete note")
        }
        
        return successful.length > 0
      }
      
      return true
    } catch (error) {
      console.error("Error deleting note:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export default noteService