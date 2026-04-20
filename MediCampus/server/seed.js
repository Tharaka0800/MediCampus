/**
 * seed.js — Seeds the database with sample Doctors, Admin, and Health Events
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Doctor     = require('./models/Doctor');
const Admin      = require('./models/Admin');
const HealthEvent = require('./models/HealthEvent');

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // ── Seed Doctors ──
    const doctors = [
        {
            name: 'Dr. Syafiqah Noor',
            specialization: 'General Practitioner',
            email: 'syafiqah@medicampus.edu',
            password: 'doctor123',
            room: 'Room 3',
            maxPatientsPerSlot: 10,
            availableSlots: [
                { day: 'Monday',    startTime: '09:00', endTime: '12:00' },
                { day: 'Monday',    startTime: '14:00', endTime: '17:00' },
                { day: 'Wednesday', startTime: '09:00', endTime: '12:00' },
                { day: 'Friday',    startTime: '09:00', endTime: '12:00' },
            ]
        },
        {
            name: 'Dr. Rahman Hakim',
            specialization: 'Internal Medicine',
            email: 'rahman@medicampus.edu',
            password: 'doctor123',
            room: 'Lab B',
            maxPatientsPerSlot: 8,
            availableSlots: [
                { day: 'Tuesday',  startTime: '10:00', endTime: '13:00' },
                { day: 'Thursday', startTime: '10:00', endTime: '13:00' },
                { day: 'Saturday', startTime: '09:00', endTime: '12:00' },
            ]
        },
        {
            name: 'Dr. Liyana Aziz',
            specialization: 'Dental Surgeon',
            email: 'liyana@medicampus.edu',
            password: 'doctor123',
            room: 'Dental Wing',
            maxPatientsPerSlot: 6,
            availableSlots: [
                { day: 'Monday',    startTime: '10:00', endTime: '12:00' },
                { day: 'Wednesday', startTime: '14:00', endTime: '17:00' },
                { day: 'Friday',    startTime: '14:00', endTime: '17:00' },
            ]
        }
    ];

    for (const doc of doctors) {
        const existing = await Doctor.findOne({ email: doc.email });
        if (!existing) {
            await Doctor.create(doc);
            console.log(`  👨‍⚕️ Created: ${doc.name}`);
        } else {
            console.log(`  ⏭️ Skipped (exists): ${doc.name}`);
        }
    }

    // ── Seed Admin ──
    const admins = [
        { name: 'Campus Nurse Admin', email: 'admin@medicampus.edu', password: 'admin123', role: 'admin' },
        { name: 'Event Coordinator',  email: 'events@medicampus.edu', password: 'admin123', role: 'organizer' },
    ];

    for (const adm of admins) {
        const existing = await Admin.findOne({ email: adm.email });
        if (!existing) {
            await Admin.create(adm);
            console.log(`  🔑 Created Admin: ${adm.name}`);
        } else {
            console.log(`  ⏭️ Skipped (exists): ${adm.name}`);
        }
    }

    // ── Seed Health Events ──
    const today = new Date();
    const events = [
        {
            title: 'Campus Blood Donation Drive',
            type: 'blood-drive',
            date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            location: 'Main Hall, Block A',
            description: 'Annual campus blood donation drive partnered with the National Blood Centre. Free health screening for all donors!',
            eligibilityCriteria: {
                minAge: 18,
                noConditions: ['Anemia', 'Hemophilia', 'HIV']
            },
            maxParticipants: 200,
            organizer: 'Student Health Services',
            status: 'upcoming'
        },
        {
            title: 'Mental Health Awareness Workshop',
            type: 'workshop',
            date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
            location: 'Auditorium, Level 3',
            description: 'A workshop on managing stress, anxiety, and maintaining mental wellness during exam season. Led by certified counselors.',
            maxParticipants: 150,
            organizer: 'Campus Counseling Unit',
            status: 'upcoming'
        },
        {
            title: 'Flu Vaccination Camp',
            type: 'vaccination',
            date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
            location: 'Campus Clinic, Ground Floor',
            description: 'Free flu vaccinations for all registered students. Walk-ins welcome!',
            eligibilityCriteria: {
                noConditions: ['Egg Allergy']
            },
            maxParticipants: 300,
            organizer: 'Student Health Services',
            status: 'upcoming'
        },
        {
            title: 'General Health Screening Camp',
            type: 'health-camp',
            date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            location: 'Gymnasium, Block C',
            description: 'Comprehensive health checkup including BMI, blood pressure, blood sugar, and vision testing. Open to all students.',
            maxParticipants: 250,
            organizer: 'Student Health Services',
            status: 'upcoming'
        }
    ];

    for (const evt of events) {
        const existing = await HealthEvent.findOne({ title: evt.title });
        if (!existing) {
            await HealthEvent.create(evt);
            console.log(`  🎪 Created Event: ${evt.title}`);
        } else {
            console.log(`  ⏭️ Skipped (exists): ${evt.title}`);
        }
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Credentials Summary:');
    console.log('  Doctors:  syafiqah@medicampus.edu / doctor123');
    console.log('           rahman@medicampus.edu   / doctor123');
    console.log('           liyana@medicampus.edu   / doctor123');
    console.log('  Admin:   admin@medicampus.edu    / admin123');
    console.log('  Events:  events@medicampus.edu   / admin123');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
});
