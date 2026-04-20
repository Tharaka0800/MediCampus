async function testBooking() {
  try {
     const studentId = '69da0bb30b98d995cfacf524'; // Using test ids from earlier
     const doctorId = '69d93f2249b06c9d6fe3af54';

     const res = await fetch('http://localhost:5000/api/appointments', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
             studentId,
             doctorId,
             date: '2026-04-21',
             timeSlot: '09:00-09:30',
             reason: 'Frontend test',
             isEmergency: false
         })
     });
     const data = await res.json();
     if (res.ok) {
         console.log("SUCCESS:", data);
     } else {
         console.log("SERVER RESPONSE ERROR:", data);
     }
  } catch(e) {
     console.log("NETWORK ERROR:", e.message);
  }
}
testBooking();
