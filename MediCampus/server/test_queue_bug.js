async function testBooking() {
  try {
     const studentId = '69da0bb30b98d995cfacf524'; // Any ID
     const doctorId = '69d93f649e7a2847603e68f5';  // Dr Rahman

     console.log("Posting to API...");
     const res = await fetch('http://localhost:5000/api/appointments', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
             studentId,
             doctorId,
             date: '2026-04-20',
             timeSlot: '16:00-16:30',
             reason: 'Debug frontend',
             isEmergency: false
         })
     });
     const data = await res.json();
     console.log("RESPONSE:", data);
  } catch(e) {
     console.log("NETWORK ERROR:", e.message);
  }
}
testBooking();
