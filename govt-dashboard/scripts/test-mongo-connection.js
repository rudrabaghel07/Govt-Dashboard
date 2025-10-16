/*
  Test server-side MongoDB connection script.
  Usage (after installing mongodb driver):
    npm install mongodb
    node scripts/test-mongo-connection.js

  This script reads MONGO_URI from environment and attempts to connect. Do NOT run this from the browser.
*/

import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI not found in environment. Please create a .env with MONGO_URI set.');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully.');
    const db = client.db();
    const names = await db.listCollections().toArray();
    console.log('Collections:', names.map(n => n.name));
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.close();
  }
}

run();
