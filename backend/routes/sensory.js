import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import confirmAppt from '../controllers/confirmAppt.js';
import getAppointmentInfo from '../utils/getAppointmentInfo.js';
import getAvailablePlayDays from '../utils/getAvailablePlayDays.js';
import cancelReservation from '../controllers/cancelReservation.js';
import authenticateUser from '../utils/authenticateUser.js';
import getAttendance from '../utils/getAttendance.js';

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
  const kidsAttending = req.body.kidsAttending;

  const apptInformation = {
    name,
    email,
    phoneNumber,
    date,
    kidsAttending,
    numberOfKids
  };

  const documentID = await confirmAppt(apptInformation);
  if (documentID) {
    res.status(200).json({ id: documentID });
  } else {
    res.status(409).json({
      id: null,
      message: 'Scheduling conflict, this day is full'
    });
  }
});


router.get('/get-available-play-days', async (req, res) => {
  const availablePlayDays = await getAvailablePlayDays();
  if (availablePlayDays) {
    res.json(availablePlayDays);
  } else {
  res.status(500).json({ message: 'Error fetching available Play Days' });
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

router.delete('/cancel-reservation', async (req, res) => {
  const { date, appointmentID } = req.body;
  const isCanceled = await cancelReservation(date, appointmentID);
  if (isCanceled) {
    res.status(200).send({ message: 'Reservation cancelled successfully' });
  } else {
    res.status(500).send({ message: 'Error cancelling reservation' });
  }
});

router.get('/admin', authenticateUser(), (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/views/admin.html'));
});

router.post('/admin/get-attendance', authenticateUser(), async (req, res) => {
  const attendance = await getAttendance(req.body.date);
  if (attendance) {
    res.json(attendance);
  } else {
  res.status(404).json({ message: 'Error fetching available Play Days' });
  }
});

export default router;