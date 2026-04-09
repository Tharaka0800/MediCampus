# MediCampus - Smart University Health Platform

A comprehensive healthcare management system with real-time appointment booking and live queue management, built with MERN stack.

## 🚀 Features

- **Appointment Booking System**: Book appointments with doctors, select time slots, prevent overbooking
- **Live Queue Management**: Real-time queue updates with Socket.io, position tracking
- **Modern UI/UX**: Glassmorphism design with dark/light mode, smooth animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Notifications**: Live updates for queue status and appointments
- **MVC Architecture**: Well-structured backend with controllers and routes

## 📱 Sections & Pages

1. **Home** - Landing page with features overview
2. **Appointments** - Book, reschedule, and cancel appointments
3. **Live Queue** - Real-time queue status and position tracking

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io, MongoDB with Mongoose
- **Real-time**: Socket.io for live updates
- **Animations**: Framer Motion
- **Icons**: Material-UI Icons
- **Routing**: React Router DOM

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start MongoDB (Windows):
   - Open Command Prompt as Administrator
   - Run: `net start MongoDB`

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```

### Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 Database Models

### Appointment
- studentId, doctorId, date, timeSlot, reason, status, queueNumber

### Queue
- appointmentId, queueNumber, status, estimatedTime

## 🔗 API Endpoints

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get appointments
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Queue
- `GET /api/queue` - Get queue status
- `GET /api/queue/user/:studentId` - Get user position
- `PUT /api/queue/:id` - Update queue status

## ✨ **Enhanced Validation Features**

### **Frontend Validations**
- **Student ID**: Format validation (S followed by 3+ digits)
- **Date Selection**: No past dates, no weekends, max 30 days advance
- **Time Slots**: Business hours only (9 AM - 4 PM), no past slots
- **Reason**: 10-500 characters, allowed characters only
- **Real-time Feedback**: Error messages for each field
- **Form State**: Visual indicators for valid/invalid fields

### **Backend Validations**
- **Input Sanitization**: Trim whitespace, validate formats
- **Business Rules**:
  - Max 10 appointments per time slot
  - Max 2 appointments per student per day
  - No double booking same time
  - Cannot cancel past/completed appointments
- **Rate Limiting**: 100 requests/15min, 10 bookings/hour per IP
- **Data Validation**: MongoDB ObjectId validation, enum checks
- **Error Handling**: Detailed error messages with specific issues

### **Validation Rules Summary**

| Field | Frontend Validation | Backend Validation |
|-------|-------------------|-------------------|
| **Student ID** | Format: S + 3+ digits | Required, format validation |
| **Doctor ID** | Selection required | Required, format validation |
| **Date** | No past, no weekends, ≤30 days | ISO date, business rules |
| **Time Slot** | Business hours, no past | Valid slots, time conflicts |
| **Reason** | 10-500 chars, allowed chars | Length, character validation |
| **Rate Limits** | - | 100 req/15min, 10 bookings/hour |

### **Common Error Messages & Solutions**

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Time slot is fully booked" | All 10 slots taken | Choose different time/doctor |
| "You already have an appointment at this time" | Double booking attempt | Select different time slot |
| "Maximum 2 appointments allowed per day per student" | Daily limit reached | Book for different day |
| "Cannot book time slots in the past" | Past time selected | Choose future time slot |
| "Appointments are only available Monday to Friday" | Weekend selected | Choose weekday |
| "Cannot book appointments more than 90 days in advance" | Too far ahead | Select nearer date |
| "Student ID must be in format S followed by at least 3 digits" | Invalid ID format | Use format like S101 |
| "Reason must be at least 10 characters long" | Too short description | Provide detailed reason |

### **Error Display Features**
- **Specific Messages**: Shows exact reason for failure
- **Visual Indicators**: Color-coded error displays
- **Helpful Tips**: Guidance for common issues
- **Retry Options**: Clear instructions to fix and retry

### **User Experience**
- **Loading States**: Skeleton loaders and spinners
- **Error Recovery**: Retry buttons for failed requests
- **Success Feedback**: Animated confirmations
- **Accessibility**: Proper labels, ARIA attributes
- **Responsive**: Works on all screen sizes

## 🎯 Usage

1. Visit home page for overview
2. Go to Appointments to book with doctors
3. Check Live Queue for real-time status
4. Toggle dark mode in navigation
5. Receive real-time notifications

This project demonstrates a production-ready healthcare management system with modern web technologies and excellent user experience.
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
client/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Hero.jsx & Hero.css
│   │   ├── Features.jsx & Features.css
│   │   ├── HowItWorks.jsx & HowItWorks.css
│   │   ├── Roles.jsx & Roles.css
│   │   ├── EmergencyEvents.jsx & EmergencyEvents.css
│   │   ├── Testimonials.jsx & Testimonials.css
│   │   ├── CTA.jsx & CTA.css
│   │   └── Footer.jsx & Footer.css
│   ├── pages/
│   │   └── Home.jsx
│   ├── services/ (for future API integration)
│   ├── App.js & App.css
│   ├── index.js & index.css
│   └── ...
└── package.json
```

## 🎨 Design System

- **Colors**: Soft blue (#667eea, #764ba2), white, green (#4ade80)
- **Fonts**: Inter, Segoe UI, Roboto (sans-serif)
- **Effects**: Glassmorphism, soft shadows, gradient highlights
- **Animations**: Smooth transitions, hover effects, scroll animations

## 🔧 Future Enhancements

- [ ] Backend integration (Express.js + MongoDB)
- [ ] User authentication
- [ ] Real-time queue tracking
- [ ] Appointment booking functionality
- [ ] Dark mode toggle
- [ ] Notification system
- [ ] Admin dashboard

## 📄 License

This project is for educational purposes as part of a university ITPM project.

## 👥 Contributing

This is a student project. Feel free to suggest improvements or contribute to the development.

---

**MediCampus** - Transforming healthcare for the modern student.