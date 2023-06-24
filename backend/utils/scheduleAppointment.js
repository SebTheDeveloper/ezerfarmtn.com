import { schedule, archive } from '../models/db.js';

export default async function scheduleAppointment({ name, email, phoneNumber, date, kidsAttending, numberOfKids }) {
  try {
    const AppointmentInfo = {
      name, email, phoneNumber, date, kidsAttending, numberOfKids
    };
    
    const existingApptCount = await schedule.countDocuments({ date: date });
    const isFullyBooked = existingApptCount >= 10 ? true : false;

    if (!isFullyBooked) {
      const result = await schedule.insertOne(AppointmentInfo);
      console.log(result);
      await archive.insertOne(AppointmentInfo);
      return result.insertedId;
    }
    return false;

  } catch(err) {
    console.error("Failed to schedule", err);
  }
}
