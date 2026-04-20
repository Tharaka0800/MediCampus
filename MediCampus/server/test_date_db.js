require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const a = await Appointment.findOne({ _id: '69e5bf40516a42715e89e8e3' });
  const apptDateStr = new Date(a.date).toDateString();
  const todayStr = new Date().toDateString();
  console.log("apptDateStr:", apptDateStr);
  console.log("todayStr:", todayStr);
  console.log("Match?", apptDateStr === todayStr);
  mongoose.disconnect();
}
test();
