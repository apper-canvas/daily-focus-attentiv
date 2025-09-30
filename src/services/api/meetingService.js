import mockMeetings from "@/services/mockData/meetings.json"

let meetings = [...mockMeetings]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const meetingService = {
  async getAll() {
    await delay(300)
    return [...meetings]
  },

  async getById(id) {
    await delay(200)
    const meeting = meetings.find(m => m.Id === parseInt(id))
    if (!meeting) {
      throw new Error("Meeting not found")
    }
    return { ...meeting }
  },

  async create(meetingData) {
    await delay(400)
    const newId = Math.max(...meetings.map(m => m.Id), 0) + 1
    const newMeeting = {
      ...meetingData,
      Id: newId,
      createdAt: new Date().toISOString()
    }
    meetings.unshift(newMeeting)
    return { ...newMeeting }
  },

  async update(id, meetingData) {
    await delay(300)
    const index = meetings.findIndex(m => m.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Meeting not found")
    }
    meetings[index] = { ...meetingData, Id: parseInt(id) }
    return { ...meetings[index] }
  },

  async delete(id) {
    await delay(250)
    const index = meetings.findIndex(m => m.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Meeting not found")
    }
    meetings.splice(index, 1)
    return true
  }
}

export default meetingService