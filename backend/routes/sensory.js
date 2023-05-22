import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sendApptConfirmEmail from '../controllers/sendApptConfirmEmail.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/views/sensory.html'));
});

router.get('/schedule', (req, res) => {
  res.sendFile(join(__dirname, '../../frontend/views/schedule.html'));
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

  // sendApptConfirmEmail(apptInformation);
  console.log(name)
  res.sendStatus(200);
});

export default router;