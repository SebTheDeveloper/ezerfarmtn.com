import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sensoryRouter from './routes/sensory.js';

const app = express();

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, '../frontend/public')));

app.get('/', (req, res) => {
  res.redirect('/sensory');
});

app.use('/sensory', sensoryRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});