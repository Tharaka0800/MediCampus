require('dotenv').config();
const mongoose = require('mongoose');
const StudentProfile = require('./models/StudentProfile');
const Appointment = require('./models/Appointment');

async function testBooking() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  // get a student
  const student = await StudentProfile.findOne();
  if (!student) {
    console.log("No student found");
  } else {
    console.log("Found student:", student.studentName, " | isProfileComplete:", student.isProfileComplete);
  }

  // check appointments
  const apt = await Appointment.find({}).sort({createdAt: -1}).limit(1);
  if (apt.length > 0) {
    console.log("Latest Appointment:", apt[0]);
  } else {
    console.log("No appointments found");
  }

  mongoose.disconnect();
}
testBooking();
