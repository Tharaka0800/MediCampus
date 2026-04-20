require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const Queue = require('./models/Queue');
const StudentProfile = require('./models/StudentProfile');

async function testLocalInsert() {
  await mongoose.connect(process.env.MONGODB_URI);
  const appointment = await Appointment.findOne({ _id: '69e5bf40516a42715e89e8e3' });
  
  try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayCount = await Queue.countDocuments({
            doctorId: appointment.doctorId,
            date: { $gte: todayStart }
        });

        // Only add to queue if appointment is today
        const apptDateStr = new Date(appointment.date).toDateString();
        const todayStr = new Date().toDateString();
        if (apptDateStr !== todayStr) return console.log("Skipped due to date");

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
        console.warn('Auto queue add skipped ERROR CAUGHT:', err);
    }
  mongoose.disconnect();
}
testLocalInsert();
