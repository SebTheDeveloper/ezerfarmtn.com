import mongodb from 'mongodb';
const ObjectID = mongodb.ObjectId;

import { schedule } from '../models/db.js';

export default async function getAppointmentInfo(appointmentID) {
  if (!ObjectID.isValid(appointmentID)) {
    return false;
  }
  const data = await schedule.findOne({ _id: new ObjectID(appointmentID) });
  if (data) return data;
  else return false;
}
