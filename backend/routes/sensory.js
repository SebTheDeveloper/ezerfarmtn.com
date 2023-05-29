import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import confirmAppt from '../controllers/confirmAppt.js';
import getAppointmentInfo from '../controllers/getAppointmentInfo.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/views/sensory.html'));
});

router.get('/schedule', (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/views/schedule.html'));
});

router.post('/schedule', async (req, res) => {
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

  const documentID = await confirmAppt(apptInformation);
  if (documentID) {
    res.status(200).redirect(`/sensory/scheduled-successfully?id=${documentID}&date=${date}`);
  } else {
    res.status(400).redirect('/sensory/nothing-available')
  }
});

router.get('/scheduled-successfully', (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/views/successful-scheduling.html'));
});

router.get('/nothing-available', (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/views/nothing-available.html'));
});

router.get('/manage-reservation', (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/views/manage-reservation.html'));
});

router.post('/get-play-day-info', async (req, res) => {
  const { date, appointmentID } = req.body;
  const apptInfo = await getAppointmentInfo(appointmentID);

  res.json(apptInfo);
});

export default router;