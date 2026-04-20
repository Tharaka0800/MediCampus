require('dotenv').config();
const mongoose = require('mongoose');

async function testDateCompare() {
  const appointmentDate = new Date('2026-04-20T00:00:00.000Z');
  const apptDateStr = appointmentDate.toDateString();
  const todayStr = new Date().toDateString();
  console.log("apptDateStr:", apptDateStr);
  console.log("todayStr:", todayStr);
  console.log("Match?", apptDateStr === todayStr);
}
testDateCompare();
