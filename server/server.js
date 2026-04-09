import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import appointmentRoutes from './routes/appointments.js';
import queueRoutes from './routes/queue.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import medicalRoutes from './routes/medical.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again later.',
    errors: ['Rate limit exceeded. Please wait before making more requests.']
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for appointment booking
const appointmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 appointment bookings per hour
  message: {
    message: 'Too many appointment bookings from this IP, please try again later.',
    errors: ['Appointment booking limit exceeded. Maximum 10 bookings per hour allowed.']
  },
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Limit payload size
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting
app.use('/api', limiter);

// Apply stricter rate limiting for appointment creation
app.use('/api/appointments', appointmentLimiter);

app.use('/api', appointmentRoutes);
app.use('/api', queueRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('MediCampus API server is running');
});

// Socket.io for real-time queue updates
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

export { io };

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});