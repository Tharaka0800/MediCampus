require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const docs = await Doctor.find({});
    console.log("Doctors in DB:");
    docs.forEach(d => console.log(`- Name: ${d.name}, Email: ${d.email}, Password: ${d.password}`));
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
test();
