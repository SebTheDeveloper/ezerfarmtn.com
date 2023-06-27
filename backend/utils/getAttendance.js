import { schedule } from "../models/db.js"

export default async function getAttendance(date) {
  const cursor = await schedule.find({ date: date });
  const matchingAppointments = await cursor.toArray();
  return matchingAppointments
}
