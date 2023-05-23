import sendEmail from '../utils/sendEmail.js';
import scheduleDB from '../models/scheduleDB.js';
import { config } from 'dotenv';
config();

export default async function confirmAppt ({ name, email, phoneNumber, date, numberOfKids }) {
  try {

    if (Number(numberOfKids) !== 0) {

      const isValid = await scheduleDB({ name, email, phoneNumber, date, numberOfKids });

      if (isValid) {
        await sendEmail({
          from: 'Ezer Farm TN',
          to: email,
          subject: 'Your Upcoming Sensory Play Day on Ezer Farm',
          html: `
            <h1 style="font-family: 'Arial';font-size:18px;">Hi ${name},</h1>
            <p style="font-family: 'Arial';font-size:18px;">This email is to confirm your scheduled Sensory Play Day for ${numberOfKids} on ${date}.
            </p>
            <p>We look forward to seeing you!</p>
            <br />
          `
        });
        console.log(`Email to ${name} at ${email} sent successfully!`);
  
        await sendEmail({
          from: 'Ezer Farm TN',
          to: process.env.NOTIFICATION_EMAIL,
          subject: `*NEW PLAY DAY REQUEST* from ${name}`,
          html: `
            <p style="font-family: 'Arial';font-size:18px;">
            ${name} just scheduled a Sensory Play Day on ${date} for ${numberOfKids} kid(s).
            </p>
            <p style="font-family: 'Arial';font-size:18px;">Their email is ${email} and their phone number is <strong>${phoneNumber}</strong></p>
            <a href="mailto:${email}" style="font-family: 'Arial';font-size:16px;">Click to send them an email</a>
            <br />
            <a href="tel:${phoneNumber}" style="font-family: 'Arial';font-size:16px;">Click to call them</a>
            <br />
          `
        });
        console.log(`Appointment confirmation for ${name} at ${email} sent successfully!`);

        return true
      } else {
        return false
      }

    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};