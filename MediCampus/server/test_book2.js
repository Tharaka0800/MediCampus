const mongoose = require('mongoose');
const StudentProfile = require('./models/StudentProfile');
const Appointment = require('./models/Appointment');
const Notification = require('./models/Notification');
const Doctor = require('./models/Doctor');

async function testBooking() {
  await mongoose.connect('mongodb://127.0.0.1:27017/medicampus');
  try {
    const studentId = '69da0bb30b98d995cfacf524';
    const doctorId = '69d93f2249b06c9d6fe3af54';
    const date = new Date('2026-04-19');
    
    console.log("Creating appointment...");
    const appointment = new Appointment({ studentId, doctorId, date: new Date(date), timeSlot: '09:00-09:30', reason: 'Test', isEmergency: false });
    await appointment.save();
    console.log("Appointment created!");

    console.log("Creating notifications...");
    await Notification.create([
      { studentId, message: "msg1", type: "Reminder" },
      { studentId, message: "msg2", type: "Reminder" }
    ]);
    console.log("Notifications created!");

  } catch (err) {
    console.log("CAUGHT ERROR:", err.message);
    console.log(err.stack);
  }
  mongoose.disconnect();
}
testBooking();
