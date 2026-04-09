import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add JWT token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Appointment APIs
export const bookAppointment = (data) =>
  API.post("/appointments", data);

export const getAppointments = (studentId) =>
  API.get(`/appointments?studentId=${studentId}`);

export const updateAppointment = (id, data) =>
  API.put(`/appointments/${id}`, data);

export const cancelAppointment = (id) =>
  API.delete(`/appointments/${id}`);

export const getAllAppointments = () =>
  API.get("/appointments");

export const getAppointmentById = (id) =>
  API.get(`/appointments/${id}`);

// Queue APIs
export const getQueue = () =>
  API.get("/queue");

export const getUserPosition = (studentId) =>
  API.get(`/queue/user/${studentId}`);

export const updateQueueStatus = (id, status) =>
  API.put(`/queue/${id}`, { status });

export const getCurrentServing = () =>
  API.get("/queue/current");

export const callNextPatient = () =>
  API.put("/queue/next");

export const skipPatient = (queueId) =>
  API.put(`/queue/${queueId}/skip`);

export const markAsEmergency = (queueId) =>
  API.put(`/queue/${queueId}/emergency`);

export const markAsDone = (queueId) =>
  API.put(`/queue/${queueId}/done`);

// Admin APIs
export const loginAdmin = (credentials) =>
  API.post("/auth/login", credentials);

export const getDashboardStats = () =>
  API.get("/admin/dashboard");

export const getAllUsers = () =>
  API.get("/admin/users");

export const updateUserRole = (userId, role) =>
  API.put(`/admin/users/${userId}/role`, { role });

export const getSystemAnalytics = () =>
  API.get("/admin/analytics");

// Doctor APIs
export const getAllDoctors = () =>
  API.get("/doctors");

export const getDoctorById = (id) =>
  API.get(`/doctors/${id}`);

export const createDoctor = (doctorData) =>
  API.post("/doctors", doctorData);

export const updateDoctor = (id, doctorData) =>
  API.put(`/doctors/${id}`, doctorData);

export const deleteDoctor = (id) =>
  API.delete(`/doctors/${id}`);

export const getDoctorAppointments = (id, filters = {}) =>
  API.get(`/doctors/${id}/appointments`, { params: filters });

export const updateDoctorAvailability = (id, availability) =>
  API.put(`/doctors/${id}/availability`, { availableSlots: availability });
