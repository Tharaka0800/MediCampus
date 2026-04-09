import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAppointments } from '../services/api';

const TimeSlotPicker = ({ doctorId, date, availableSlots, setAvailableSlots }) => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeSlots = [
    { value: '09:00', label: '9:00 AM', display: '9:00 AM' },
    { value: '10:00', label: '10:00 AM', display: '10:00 AM' },
    { value: '11:00', label: '11:00 AM', display: '11:00 AM' },
    { value: '14:00', label: '2:00 PM', display: '2:00 PM' },
    { value: '15:00', label: '3:00 PM', display: '3:00 PM' },
    { value: '16:00', label: '4:00 PM', display: '4:00 PM' },
  ];

  useEffect(() => {
    if (doctorId && date) {
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
      setError(null);
    }
  }, [doctorId, date]);

  const fetchBookedSlots = async () => {
    if (!doctorId || !date) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getAppointments();
      const booked = response.data
        .filter(apt =>
          apt.doctorId === doctorId &&
          new Date(apt.date).toDateString() === date.toDateString() &&
          ['booked', 'rescheduled'].includes(apt.status)
        )
        .map(apt => apt.timeSlot);

      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setError('Failed to load availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatus = (slotValue) => {
    const count = bookedSlots.filter(s => s === slotValue).length;
    const maxSlots = 10;

    if (count >= maxSlots) {
      return { status: 'full', count, maxSlots };
    } else if (count >= maxSlots * 0.8) {
      return { status: 'almost-full', count, maxSlots };
    } else {
      return { status: 'available', count, maxSlots };
    }
  };

  const isSlotInPast = (slotValue) => {
    const now = new Date();
    const selectedDate = new Date(date);
    const [hours, minutes] = slotValue.split(':').map(Number);
    selectedDate.setHours(hours, minutes, 0, 0);

    return selectedDate <= now;
  };

  const getSlotClassName = (slotStatus, isPast) => {
    if (isPast) {
      return 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed border-2 border-gray-400 dark:border-gray-500';
    }

    switch (slotStatus.status) {
      case 'full':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-2 border-red-300 dark:border-red-600 cursor-not-allowed';
      case 'almost-full':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-2 border-yellow-300 dark:border-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-800/30';
      default:
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-600 hover:bg-green-200 dark:hover:bg-green-800/30';
    }
  };

  const getSlotText = (slotStatus, isPast) => {
    if (isPast) {
      return 'Unavailable';
    }

    const remaining = slotStatus.maxSlots - slotStatus.count;
    switch (slotStatus.status) {
      case 'full':
        return 'Full';
      case 'almost-full':
        return `${remaining} left`;
      default:
        return `${remaining} slots`;
    }
  };

  if (!doctorId || !date) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Available Time Slots</h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200">
            Please select a doctor and date to view available time slots.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Available Time Slots</h2>

      {loading && (
        <div className="mb-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading availability...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
          {error}
          <button
            onClick={fetchBookedSlots}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map((slot) => {
          const slotStatus = getSlotStatus(slot.value);
          const isPast = isSlotInPast(slot.value);
          const isAvailable = slotStatus.status !== 'full' && !isPast;

          return (
            <motion.button
              key={slot.value}
              className={`p-4 rounded-lg font-medium transition-all duration-300 text-center ${getSlotClassName(slotStatus, isPast)}`}
              disabled={!isAvailable}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
            >
              <div className="text-lg font-semibold">{slot.display}</div>
              <div className="text-sm mt-1">
                {getSlotText(slotStatus, isPast)}
              </div>
              {slotStatus.count > 0 && !isPast && (
                <div className="text-xs mt-1 opacity-75">
                  {slotStatus.count} booked
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-600 rounded"></div>
          <span>Available (spots remaining)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded"></div>
          <span>Limited availability</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-600 rounded"></div>
          <span>Fully booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 border-2 border-gray-400 dark:border-gray-500 rounded"></div>
          <span>Unavailable (past time)</span>
        </div>
        <p className="mt-2 text-xs">Maximum 10 appointments per time slot</p>
      </div>
    </div>
  );
};

export default TimeSlotPicker;