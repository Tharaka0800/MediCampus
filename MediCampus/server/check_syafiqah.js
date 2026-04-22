require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const doc = await Doctor.findOne({ email: 'syafiqah@medicampus.edu' });
    if (doc) {
      console.log(`Found Doctor: ${doc.name}`);
      console.log(`Email: ${doc.email}`);
      console.log(`Password in DB: ${doc.password || 'MISSING/UNDEFINED'}`);
    } else {
      console.log("Doctor 'syafiqah@medicampus.edu' not found in database.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
test();
