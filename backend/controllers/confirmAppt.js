import sendEmail from '../utils/sendEmail.js';
import scheduleAppointment from '../utils/scheduleAppointment.js';
import { config } from 'dotenv';
config();

export default async function confirmAppt ({ name, email, phoneNumber, date, numberOfKids }) {
  try {

    if (Number(numberOfKids) !== 0) {

      const documentID = await scheduleAppointment({ name, email, phoneNumber, date, numberOfKids });

      if (documentID) {
        await sendEmail({
          from: 'Ezer Farm TN',
          to: email,
          subject: 'Your Upcoming Sensory Play Day on Ezer Farm',
          html: `
            <h1 style="font-family: 'Arial';font-size:18px;">Hi ${name},</h1>
            <p style="font-family: 'Arial';font-size:18px;">This email is to confirm your scheduled Sensory Play Day for ${numberOfKids} on ${date}.
            </p>
            <p style="font-family: 'Arial';font-size:18px;">We look forward to seeing you!</p>
            <br />
            <a href="ezerfarmtn.com/sensory/manage-reservation?id=${documentID}&date=${date}"><button style="padding: 12px 16px;">Manage My Reservation</button></a>
          `
        });
  
        await sendEmail({
          from: 'Ezer Farm TN',
          to: process.env.NOTIFICATION_EMAIL,
          subject: `*NEW PLAY DAY RESERVATION* from ${name}`,
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
        console.log(`Appointment confirmation emails for ${name} at ${email} sent successfully!`);

        return documentID;
      } else {
        return false;
      }

    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};