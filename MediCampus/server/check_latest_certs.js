require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");
  const certs = await mongoose.connection.db.collection('medicalcertificates').find({}).sort({ createdAt: -1 }).limit(5).toArray();
  console.log("Recent Certificates:");
  certs.forEach(c => console.log(`- ID: ${c._id}, Type: ${c.certificateType}, Reason: ${c.reason}, Issued: ${c.createdAt}`));
  mongoose.disconnect();
}
test();
