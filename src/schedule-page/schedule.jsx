import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  eachDayOfInterval,
  isBefore,
  startOfToday
} from 'date-fns';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import './schedule.css';
import BookingModal from '../components/bookingmodals';
import { motion } from 'framer-motion'; // Added

const Schedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = startOfToday();

  const bookingStats = useQuery(api.bookings.getMonthAvailability, { 
    month: format(currentMonth, 'yyyy-MM') 
  });

  const isLoading = bookingStats === undefined;
  const stats = bookingStats || {};

  // Animation variants for the text side
  const containerVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8, 
        staggerChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleDateClick = (day) => {
    const isPast = isBefore(day, today);
    if (isSameMonth(day, startOfMonth(currentMonth)) && !isPast) {
      setSelectedDate(day);
      setIsModalOpen(true);
    }
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
      <div className="nav-btns">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>&lt;</button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>&gt;</button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return (
      <div className="days-row">
        {days.map((day, index) => (
          <div className="column label" key={index}>{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className={`calendar-grid ${isLoading ? 'loading-blur' : ''}`}>
        {calendarDays.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const bookingCount = stats[dateKey] || 0;
          
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isPast = isBefore(day, today);

          let statusClass = 'status-grey'; 
          if (isCurrentMonth && !isPast) {
             statusClass = bookingCount >= 3 ? 'status-red' : 'status-green';
          }

          return (
            <div
              className={`cell ${(!isCurrentMonth || isPast) ? 'disabled' : ''}`}
              key={index}
              onClick={() => handleDateClick(day)}
              style={{ cursor: (!isCurrentMonth || isPast) ? 'not-allowed' : 'pointer' }}
            >
              <span className="number">{format(day, 'd')}</span>
              {isCurrentMonth && !isPast && !isLoading && (
                <span className={`status-dot ${statusClass}`}></span>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="calendar-loader-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="schedule-page">
      <div className="schedule-content">
        <motion.div 
          className="info-side"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h1 className="main-title" variants={itemVariants}>
            Book <br />
            <span className="script-font">Polomolok's</span>
            <br />
            <span className="sub-title">Finest Nails Today!</span>
          </motion.h1>

          <motion.div className="instructions" variants={itemVariants}>
            <p>Follow these simple steps to secure your appointment:</p>
            <ol>
              <li>Pick a Time and Date</li>
              <li>Provide your Details</li>
              <li>Confirm Appointment</li>
              <li>Get Confirmation</li>
            </ol>
            <div className="pro-tips">
              <p><strong>Tips:</strong></p>
              <ul>
                <li>Appointments are on a <strong>first-come, first-served</strong> basis.</li>
                <li>Please arrive <strong>5-10 minutes</strong> early.</li>
                <li>Need to reschedule? Contact us at <strong>0978123871</strong></li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        <div className="calendar-side">
          <p className="pick-label">Pick a Date</p>
          <div className="calendar-card">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <BookingModal 
          selectedDate={selectedDate} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </section>
  );
};

export default Schedule;