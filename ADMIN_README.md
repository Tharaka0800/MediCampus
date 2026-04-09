# MediCampus Admin Panel

## 🚀 Complete Admin Dashboard & Management System

A modern, fully-functional administrative control system for MediCampus - Smart University Health Platform.

## ✨ Features

### 📊 **Dashboard Overview**
- Real-time system statistics
- Today's appointments count
- Active queue monitoring
- Completed consultations
- Available doctors
- Emergency alerts with red glow indicators

### ⚡ **Queue Management (CORE FEATURE)**
- **Call Next Patient** - Advance queue automatically
- **Skip Patient** - Move patient to end of queue
- **Mark Emergency** - Prioritize urgent cases
- **Mark as Done** - Complete consultations
- Digital queue board with large, bold numbers
- Color-coded status indicators (Green=Active, Yellow=Waiting, Red=Emergency)

### 👨‍⚕️ **Doctor Management**
- Add new doctors with full profile
- Edit doctor details and availability
- Set time slots for each day
- Remove doctors (with safety checks)
- Specialization and license management

### 🔐 **Security & Authentication**
- JWT-based authentication
- Role-based access control
- Admin-only routes protection
- Secure login system

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.io** for real-time updates
- **bcrypt** for password hashing
- **express-rate-limit** for abuse prevention

### Frontend
- **React.js** with modern hooks
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **React Router** for navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and setup:**
   ```bash
   cd server
   npm install
   npm run seed  # Populate database with sample data
   npm start     # Start backend server on port 5000
   ```

2. **Frontend setup:**
   ```bash
   cd client
   npm install
   npm start     # Start React app on port 3000
   ```

### Admin Access

**Login URL:** `http://localhost:3000/admin/login`

**Demo Credentials:**
- **Email:** `admin@medicampus.edu`
- **Password:** `admin123`

**Doctor Accounts:**
- `sarah.johnson@medicampus.edu` / `doctor123`
- `michael.chen@medicampus.edu` / `doctor123`

## 📁 Project Structure

```
MediCampusV2/
├── server/
│   ├── models/           # MongoDB schemas
│   │   ├── User.js       # User model with roles
│   │   ├── Doctor.js     # Doctor profiles
│   │   ├── Appointment.js # Appointment data
│   │   └── Queue.js      # Queue management
│   ├── controllers/      # Business logic
│   │   ├── adminController.js
│   │   ├── doctorController.js
│   │   └── queue.js
│   ├── routes/           # API endpoints
│   │   ├── adminRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/       # Auth & validation
│   │   └── auth.js
│   └── server.js         # Main server file
├── client/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── QueueControlPanel.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── ManageDoctors.jsx
│   │   └── services/     # API service layer
│   │       └── api.js
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register new user (admin only)

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role

### Doctor Management
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Queue Control
- `PUT /api/queue/next` - Call next patient
- `PUT /api/queue/:id/skip` - Skip patient
- `PUT /api/queue/:id/emergency` - Mark as emergency
- `PUT /api/queue/:id/done` - Mark as completed

## 🎨 UI/UX Features

- **Dark SaaS Theme** - Professional appearance
- **Glassmorphism** - Modern backdrop blur effects
- **Smooth Animations** - Framer Motion powered
- **Responsive Design** - Works on all devices
- **Real-time Updates** - Live data refresh
- **Emergency Alerts** - Visual priority indicators

## 🔒 Security Features

- JWT token authentication
- Role-based access control
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Secure password handling
- CORS protection

## 🚀 Production Deployment

1. Set environment variables:
   ```bash
   JWT_SECRET=your_super_secret_key
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

2. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name medicampus-admin
   ```

3. Configure reverse proxy (nginx) for production

## 📈 Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Appointment scheduling calendar
- [ ] Patient management system
- [ ] Notification system (email/SMS)
- [ ] Multi-language support
- [ ] API documentation (Swagger)
- [ ] Automated testing suite

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, email support@medicampus.edu or create an issue in this repository.

---

**Built with ❤️ for MediCampus - Smart University Health Platform**