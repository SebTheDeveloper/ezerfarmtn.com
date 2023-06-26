import { schedule } from "../models/db.js"

export default async function getAttendance(date) {
  const cursor = await schedule.find({ date: date });
  const matchingAppointments = await cursor.toArray();
  if (matchingAppointments.length > 0) {
    console.log('appointments found')
  } else {
    console.log('nothing found')
  }
  return matchingAppointments
}
