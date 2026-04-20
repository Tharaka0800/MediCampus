require('dotenv').config();
const mongoose = require('mongoose');
const Queue = require('./models/Queue');
const Appointment = require('./models/Appointment');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const dr = '69d93f649e7a2847603e68f5';
  const queues = await Queue.find({ doctorId: dr }).sort({ createdAt: -1 });
  console.log("Total queues for Dr. Rahman:", queues.length);
  queues.forEach(q => console.log(`- Token ${q.tokenNumber}, Date: ${q.date}, ApptId: ${q.appointmentId}, CheckInTime: ${q.checkInTime}`));

  const appts = await Appointment.find({ doctorId: dr }).sort({ createdAt: -1 });
  console.log("\nTotal appts for Dr. Rahman:", appts.length);
  appts.forEach(a => console.log(`- Appt Date: ${a.date}, Created: ${a.createdAt}`));

  mongoose.disconnect();
}
test();
