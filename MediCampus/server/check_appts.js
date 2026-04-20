require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const Doctor = require('./models/Doctor');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const docs = await Doctor.find({});
  console.log("Doctors: ", docs.map(d => ({ name: d.name, id: d._id })));

  const appts = await Appointment.find().sort({ createdAt: -1 }).limit(5);
  console.log("\nLast 5 Appointments:");
  appts.forEach(a => {
      console.log(`- Date: ${a.date.toISOString()}, DoctorId: ${a.doctorId}, Status: ${a.status}, CreatedAt: ${a.createdAt}`);
  });
  mongoose.disconnect();
}
test();
