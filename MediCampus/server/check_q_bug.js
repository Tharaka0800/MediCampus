require('dotenv').config();
const mongoose = require('mongoose');
const Queue = require('./models/Queue');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const q = await Queue.findOne({ appointmentId: '69e5bf40516a42715e89e8e3' });
  console.log("Queue created?", !!q);
  mongoose.disconnect();
}
check();
