import { config } from 'dotenv';
config();

import { MongoClient } from 'mongodb';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_COLLECTION}.raoxq9c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

let schedule;

async function startDatabase() {
  try {
    await client.connect();
    const database = client.db('ezerfarmtn');
    schedule = database.collection('schedule');
    console.log("Connected to MongoDB successfully");
  } catch(err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

await startDatabase();

export { schedule }