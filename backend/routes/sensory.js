import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import confirmAppt from '../controllers/confirmAppt.js';

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

  const isConfirmed = await confirmAppt(apptInformation);
  if (isConfirmed) {
    res.status(200).redirect('/sensory/confirmed');
  } else {
    res.status(400).redirect('/sensory/nothing-available')
  }
});

router.get('/confirmed', (req, res) => {
  res.send('Your Sensory Play Day has been Scheduled! Check your email for confirmation');
});

router.get('/nothing-available', (req, res) => {
  res.send('Unfortunately, we do not have any more availability on these dates. Please contact us for more information');
});

export default router;