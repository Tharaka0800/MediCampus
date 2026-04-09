import mongoose from 'mongoose';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/medicampus');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@medicampus.edu',
    password: 'admin123', // In production, hash passwords
    role: 'admin'
  },
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medicampus.edu',
    password: 'doctor123',
    role: 'doctor'
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@medicampus.edu',
    password: 'doctor123',
    role: 'doctor'
  }
];

const sampleDoctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medicampus.edu',
    specialization: 'General Medicine',
    licenseNumber: 'MD123456',
    phone: '+1-555-0101',
    availableSlots: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true }
    ]
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@medicampus.edu',
    specialization: 'Cardiology',
    licenseNumber: 'MD789012',
    phone: '+1-555-0102',
    availableSlots: [
      { day: 'Monday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Tuesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Wednesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Friday', startTime: '10:00', endTime: '18:00', isAvailable: true }
    ]
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@medicampus.edu',
    specialization: 'Pediatrics',
    licenseNumber: 'MD345678',
    phone: '+1-555-0103',
    availableSlots: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Friday', startTime: '08:00', endTime: '16:00', isAvailable: true }
    ]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});

    // Insert sample users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log('Sample users created:', createdUsers.length);

    // Insert sample doctors
    const createdDoctors = await Doctor.insertMany(sampleDoctors);
    console.log('Sample doctors created:', createdDoctors.length);

    console.log('Database seeded successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log('Email: admin@medicampus.edu');
    console.log('Password: admin123');
    console.log('\nDoctor Login Credentials:');
    console.log('Email: sarah.johnson@medicampus.edu or michael.chen@medicampus.edu');
    console.log('Password: doctor123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
connectDB().then(() => {
  seedDatabase();
});