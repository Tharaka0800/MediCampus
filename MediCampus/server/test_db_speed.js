require('dotenv').config();
const mongoose = require('mongoose');

async function testSpeed() {
  console.log("Starting connection test...");
  const start = Date.now();
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`Connected in ${Date.now() - start}ms`);
    
    const findStart = Date.now();
    const doc = await mongoose.connection.db.collection('doctors').findOne({});
    console.log(`Found a doctor in ${Date.now() - findStart}ms:`, doc ? doc.name : 'No doctor found');
    
  } catch (err) {
    console.error("Connection/Query FAILED:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}
testSpeed();
