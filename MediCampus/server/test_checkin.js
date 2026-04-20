require('dotenv').config();
const mongoose = require('mongoose');
const Queue = require('./models/Queue');
const Appointment = require('./models/Appointment');
const Doctor = require('./models/Doctor');

async function simulateCheckin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Get a recent appointment
  const appt = await Appointment.findOne({ arrivalStatus: 'not-arrived' }).sort({ createdAt: -1 });
  if (!appt) {
    console.log("No un-arrived appointments found.");
    mongoose.disconnect();
    return;
  }

  console.log(`Found appointment: ${appt._id}. Checking in...`);
  
  // change to arrived
  appt.arrivalStatus = 'arrived';
  appt.status = 'confirmed';
  await appt.save();

  // Create queue entry
  const today = new Date();
  today.setHours(0,0,0,0);

  const todayCount = await Queue.countDocuments({
      doctorId: appt.doctorId,
      date: { $gte: today }
  });

  const queueEntry = new Queue({
      appointmentId: appt._id,
      doctorId: appt.doctorId,
      studentId: appt.studentId,
      tokenNumber: todayCount + 1,
      priority: appt.isEmergency ? 'emergency' : 'normal',
      checkInTime: new Date(),
      estimatedWaitMinutes: todayCount * 15,
      date: new Date()
  });

  await queueEntry.save();
  console.log("QueueEntry created!");
  mongoose.disconnect();
}
simulateCheckin();
