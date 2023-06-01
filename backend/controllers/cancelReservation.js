import sendEmail from '../utils/sendEmail.js';
import { config } from 'dotenv';
config();

import mongodb from 'mongodb';
const ObjectID = mongodb.ObjectId;

import { schedule } from '../models/db.js';

export default async function cancelReservation(date, appointmentID) {

  try {
    if (appointmentID) {

      const existingAppt = await clearDB(appointmentID);
      const { name, email, numberOfKids, phoneNumber } = existingAppt;
      
      if(!email) {
        console.error('Appointment not found - cancellation could not be processed');
        return false;
      }

      await sendEmail({
        from: 'Ezer Farm TN',
        to: email,
        subject: 'Your Sensory Play Day Has Been Canceled',
        html: `
          <h1 style="font-family: 'Arial';font-size:18px;">Hi ${name},</h1>
          <p style="font-family: 'Arial';font-size:18px;">Your Sensory Play Day for ${date} has been canceled.
          </p>
          <p style="font-family: 'Arial';font-size:18px;">If you would like to make a new reservation, please visit our website-</p>
          <br />
          <a href="ezerfarmtn.com"><button style="padding: 12px 16px;">EzerFarmTN.com</button></a>
        `
      });

      await sendEmail({
        from: 'Ezer Farm TN',
        to: process.env.NOTIFICATION_EMAIL,
        subject: `*CANCELED PLAY DAY* for ${name} on ${date}`,
        bcc: process.env.BCC_EMAIL,
        html: `
          <p style="font-family: 'Arial';font-size:18px;">
          ${name} canceled their Sensory Play Day on ${date} for ${numberOfKids} kid(s).
          </p>
          <p style="font-family: 'Arial';font-size:18px;">Their email is ${email} and their phone number is <strong>${phoneNumber}</strong></p>
          <br />
        `
      });
      console.log(`Canceled Reservation emails for ${name} at ${email} sent successfully`);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error sending cancel email:', error);
  }
}

async function clearDB(appointmentID) {
  const existingAppt = await schedule.findOne({ _id: new ObjectID(appointmentID) });
  
  if (existingAppt) {
    const isCanceled = await schedule.deleteOne({ _id: new ObjectID(appointmentID) });
    if (isCanceled.acknowledged) {
      console.log(isCanceled);
      return existingAppt;
    }
    else return false
  } else return false

}