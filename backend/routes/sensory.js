import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/views/sensory.html'));
});

router.post('/schedule', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const date = req.body.date;
  const numberOfKids = req.body.numberOfKids;

  const apptInformation = {
    name,
    email,
    phoneNumber,
    date,
    numberOfKids,
  };

  sendApptConfirmEmail(apptInformation);

  res.sendStatus(200);
});

const sendApptConfirmEmail = async ({ name, email, phoneNumber, date, numberOfKids }) => {
  try {
    await sendEmail({
      from: 'Ezer Farm TN',
      to: email,
      subject: 'Your Upcoming Sensory Play Day on Ezer Farm',
      html: `<h1>Hi ${name}, this email is to confirm your scheduled Sensory Play Day on ${date}</h1>
      <p>We have your contact number as ${phoneNumber} and have the reservation set for ${numberOfKids} kid(s).
      We look forward to seeing you!</p>`
    });

    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default router;