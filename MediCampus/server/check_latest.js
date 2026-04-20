require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const a = await Appointment.findOne().sort({ createdAt: -1 });
  console.log("Most recent appointment booked:");
  console.log("Doctor:", a.doctorId);
  console.log("Date:", a.date);
  mongoose.disconnect();
}
test();
