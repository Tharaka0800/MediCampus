require('dotenv').config();
const mongoose = require('mongoose');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for data check.");
    
    // Check for collections and counts
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Found collections:", collections.map(c => c.name).join(', '));
    
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`- ${coll.name}: ${count} documents`);
    }

  } catch (err) {
    console.error("Data check failed:", err);
  } finally {
    mongoose.disconnect();
  }
}
checkData();
