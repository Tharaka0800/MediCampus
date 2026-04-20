require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const Queue = require('./models/Queue');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);

  const appointment = await Appointment.findOne().sort({ createdAt: -1 });
  if (!appointment) return console.log("No appt");

  try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayCount = await Queue.countDocuments({
            doctorId: appointment.doctorId,
            date: { $gte: todayStart }
        });

        const queueEntry = new Queue({
            appointmentId: appointment._id,
            doctorId: appointment.doctorId,
            studentId: appointment.studentId,
            tokenNumber: todayCount + 1,
            priority: appointment.isEmergency ? 'emergency' : 'normal',
            checkInTime: new Date(),
            estimatedWaitMinutes: todayCount * 15,
            date: new Date()
        });
        await queueEntry.save();
        console.log('Auto-added to queue: token', queueEntry.tokenNumber);
    } catch (err) {
        console.warn('Auto queue add skipped:', err.message);
    }
    mongoose.disconnect();
}
test();
