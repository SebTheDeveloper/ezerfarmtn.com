import { config } from 'dotenv';
config();

import { MongoClient } from 'mongodb';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ezerfarmschedule.raoxq9c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

export default async function scheduleDB({ name, email, phoneNumber, date, numberOfKids }) {
  try {
    await client.connect();
    const database = client.db('ezerfarmtn');
    const schedule = database.collection('schedule');

    const AppointmentInfo = {
      name, email, phoneNumber, date, numberOfKids
    };
    
    const existingApptCount = await schedule.countDocuments({ date: date });
    const isFullyBooked = existingApptCount >= 10 ? true : false;

    if (!isFullyBooked) {
      const result = await schedule.insertOne(AppointmentInfo);
      console.log(result);
      return true;
    }
    return false;

  } finally {
    await client.close();
  }
}