require('dotenv').config();
const mongoose = require('mongoose');
const Queue = require('./models/Queue');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const StudentProfile = require('./models/StudentProfile');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const rh = await Doctor.findOne({ email: 'rahman@medicampus.edu' });
    if (!rh) return console.log("Dr Rahman not found");
    
    // Find today's queue for Dr Rahman
    const today = new Date(); today.setHours(0,0,0,0);
    const queue = await Queue.find({
        doctorId: rh._id,
        date: { $gte: today }
    });
    console.log(`Today's Queue items for Dr. Rahman: ${queue.length}`);

    // Create a new queue item for today
    if (queue.length === 0) {
        // let's just make a new appointment and queue it
        const student = await StudentProfile.findOne();
        if (student) {
           const appt = await Appointment.create({
               studentId: student._id,
               doctorId: rh._id,
               date: new Date(),
               timeSlot: '10:00-10:30',
               status: 'confirmed',
               arrivalStatus: 'arrived',
               isEmergency: false
           });
           
           await Queue.create({
              appointmentId: appt._id,
              doctorId: rh._id,
              studentId: appt.studentId,
              tokenNumber: 1,
              priority: 'normal',
              checkInTime: new Date(),
              estimatedWaitMinutes: 0,
              date: new Date(),
              status: 'waiting'
           });
           console.log("Created a new Queue item for today assigned to Dr. Rahman!");
        }
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
test();
