const taskService = {
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      }

      const response = await apperClient.fetchRecords('task_c', params)
      
      if (!response?.success) {
        console.error("Error fetching tasks:", response?.message || "Unknown error")
        return []
      }

      return response.data?.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c || "",
        completed: task.completed_c || false,
        priority: task.priority_c || "medium",
        category: task.category_c || "personal",
        dueDate: task.due_date_c || null,
        createdAt: task.created_at_c || task.CreatedOn
      })) || []
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      }

      const response = await apperClient.getRecordById('task_c', parseInt(id), params)
      
      if (!response?.data) {
        return null
      }

      const task = response.data
      return {
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c || "",
        completed: task.completed_c || false,
        priority: task.priority_c || "medium",
        category: task.category_c || "personal",
        dueDate: task.due_date_c || null,
        createdAt: task.created_at_c || task.CreatedOn
      }
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const createData = {
        Name: taskData.title,
        title_c: taskData.title,
        description_c: taskData.description || "",
        completed_c: taskData.completed || false,
        priority_c: taskData.priority || "medium",
        category_c: taskData.category || "personal",
        due_date_c: taskData.dueDate || null,
        created_at_c: new Date().toISOString()
      }

      const params = {
        records: [createData]
      }

      const response = await apperClient.createRecord('task_c', params)

      if (!response.success) {
        console.error("Error creating task:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed)
          throw new Error("Failed to create task")
        }
        
        if (successful.length > 0) {
          const created = successful[0].data
          return {
            Id: created.Id,
            title: created.title_c || created.Name,
            description: created.description_c || "",
            completed: created.completed_c || false,
            priority: created.priority_c || "medium",
            category: created.category_c || "personal",
            dueDate: created.due_date_c || null,
            createdAt: created.created_at_c || created.CreatedOn
          }
        }
      }
      
      throw new Error("No successful results returned")
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const updateData = {
        Id: parseInt(id),
        Name: taskData.title,
        title_c: taskData.title,
        description_c: taskData.description || "",
        completed_c: taskData.completed || false,
        priority_c: taskData.priority || "medium",
        category_c: taskData.category || "personal",
        due_date_c: taskData.dueDate || null
      }

      const params = {
        records: [updateData]
      }

      const response = await apperClient.updateRecord('task_c', params)

      if (!response.success) {
        console.error("Error updating task:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed)
          throw new Error("Failed to update task")
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data
          return {
            Id: updated.Id,
            title: updated.title_c || updated.Name,
            description: updated.description_c || "",
            completed: updated.completed_c || false,
            priority: updated.priority_c || "medium",
            category: updated.category_c || "personal",
            dueDate: updated.due_date_c || null,
            createdAt: updated.created_at_c || updated.CreatedOn
          }
        }
      }
      
      throw new Error("No successful results returned")
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
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

      const response = await apperClient.deleteRecord('task_c', params)

      if (!response.success) {
        console.error("Error deleting task:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed)
          throw new Error("Failed to delete task")
        }
        
        return successful.length > 0
      }
      
      return true
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export default taskService

export default taskService