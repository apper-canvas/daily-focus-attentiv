const meetingService = {
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
          {"field": {"Name": "datetime_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "participants_c"}},
          {"field": {"Name": "agenda_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "datetime_c", "sorttype": "ASC"}]
      }

      const response = await apperClient.fetchRecords('meeting_c', params)
      
      if (!response?.success) {
        console.error("Error fetching meetings:", response?.message || "Unknown error")
        return []
      }

      return response.data?.map(meeting => ({
        Id: meeting.Id,
        title: meeting.title_c || meeting.Name,
        datetime: meeting.datetime_c || new Date().toISOString(),
        duration: meeting.duration_c || 60,
        participants: meeting.participants_c ? (typeof meeting.participants_c === 'string' ? meeting.participants_c.split(',').map(p => p.trim()) : meeting.participants_c) : [],
        agenda: meeting.agenda_c || "",
        status: meeting.status_c || "upcoming",
        createdAt: meeting.created_at_c || meeting.CreatedOn
      })) || []
    } catch (error) {
      console.error("Error fetching meetings:", error?.response?.data?.message || error)
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
          {"field": {"Name": "datetime_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "participants_c"}},
          {"field": {"Name": "agenda_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      }

      const response = await apperClient.getRecordById('meeting_c', parseInt(id), params)
      
      if (!response?.data) {
        return null
      }

      const meeting = response.data
      return {
        Id: meeting.Id,
        title: meeting.title_c || meeting.Name,
        datetime: meeting.datetime_c || new Date().toISOString(),
        duration: meeting.duration_c || 60,
        participants: meeting.participants_c ? (typeof meeting.participants_c === 'string' ? meeting.participants_c.split(',').map(p => p.trim()) : meeting.participants_c) : [],
        agenda: meeting.agenda_c || "",
        status: meeting.status_c || "upcoming",
        createdAt: meeting.created_at_c || meeting.CreatedOn
      }
    } catch (error) {
      console.error(`Error fetching meeting ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(meetingData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const createData = {
        Name: meetingData.title,
        title_c: meetingData.title,
        datetime_c: meetingData.datetime || new Date().toISOString(),
        duration_c: meetingData.duration || 60,
        participants_c: Array.isArray(meetingData.participants) ? meetingData.participants.join(',') : (meetingData.participants || ""),
        agenda_c: meetingData.agenda || "",
        status_c: meetingData.status || "upcoming",
        created_at_c: new Date().toISOString()
      }

      const params = {
        records: [createData]
      }

      const response = await apperClient.createRecord('meeting_c', params)

      if (!response.success) {
        console.error("Error creating meeting:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} meetings:`, failed)
          throw new Error("Failed to create meeting")
        }
        
        if (successful.length > 0) {
          const created = successful[0].data
          return {
            Id: created.Id,
            title: created.title_c || created.Name,
            datetime: created.datetime_c || new Date().toISOString(),
            duration: created.duration_c || 60,
            participants: created.participants_c ? (typeof created.participants_c === 'string' ? created.participants_c.split(',').map(p => p.trim()) : created.participants_c) : [],
            agenda: created.agenda_c || "",
            status: created.status_c || "upcoming",
            createdAt: created.created_at_c || created.CreatedOn
          }
        }
      }
      
      throw new Error("No successful results returned")
    } catch (error) {
      console.error("Error creating meeting:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, meetingData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const updateData = {
        Id: parseInt(id),
        Name: meetingData.title,
        title_c: meetingData.title,
        datetime_c: meetingData.datetime || new Date().toISOString(),
        duration_c: meetingData.duration || 60,
        participants_c: Array.isArray(meetingData.participants) ? meetingData.participants.join(',') : (meetingData.participants || ""),
        agenda_c: meetingData.agenda || "",
        status_c: meetingData.status || "upcoming"
      }

      const params = {
        records: [updateData]
      }

      const response = await apperClient.updateRecord('meeting_c', params)

      if (!response.success) {
        console.error("Error updating meeting:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} meetings:`, failed)
          throw new Error("Failed to update meeting")
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data
          return {
            Id: updated.Id,
            title: updated.title_c || updated.Name,
            datetime: updated.datetime_c || new Date().toISOString(),
            duration: updated.duration_c || 60,
            participants: updated.participants_c ? (typeof updated.participants_c === 'string' ? updated.participants_c.split(',').map(p => p.trim()) : updated.participants_c) : [],
            agenda: updated.agenda_c || "",
            status: updated.status_c || "upcoming",
            createdAt: updated.created_at_c || updated.CreatedOn
          }
        }
      }
      
      throw new Error("No successful results returned")
    } catch (error) {
      console.error("Error updating meeting:", error?.response?.data?.message || error)
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

      const response = await apperClient.deleteRecord('meeting_c', params)

      if (!response.success) {
        console.error("Error deleting meeting:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} meetings:`, failed)
          throw new Error("Failed to delete meeting")
        }
        
        return successful.length > 0
      }
      
      return true
    } catch (error) {
      console.error("Error deleting meeting:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export default meetingService

export default meetingService