

const currDate = new Date()
const prevDate = new Date()
prevDate.setDate(prevDate.getDate() - 1);

const initialTasks = [
  {
    taskName: "Leetcode",
    description: "LC50",
    status: "todo",
    hoursSpent: 0,
    createDate: currDate,
    user: null
  },
  {
    taskName: "Webdev",
    description: "BE",
    status: "completed",
    hoursSpent: 3,
    createDate: prevDate,
    user: null
  }
]

module.exports = {
  initialTasks
}
