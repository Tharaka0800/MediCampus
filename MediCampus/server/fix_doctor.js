require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');

async function fix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const doc = await Doctor.findOne({ email: 'rahman@medicampus.edu' });
    if (doc) {
      doc.password = 'doctor123';
      await doc.save();
      console.log("Updated Dr. Rahman password!");
    } else {
      console.log("Not found.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
fix();
