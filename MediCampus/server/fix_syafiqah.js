require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');

async function fix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const doc = await Doctor.findOne({ email: 'syafiqah@medicampus.edu' });
    if (doc) {
      doc.password = 'doctor123';
      await doc.save();
      console.log("Successfully updated Dr. Syafiqah's password to 'doctor123'!");
    } else {
      console.log("Doctor not found.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
fix();
