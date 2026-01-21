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
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import './schedule.css';
import BookingModal from '../components/bookingmodals';

const Schedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get availability for the dots
  const bookingStats = useQuery(api.bookings.getMonthAvailability, { 
    month: format(currentMonth, 'yyyy-MM') 
  }) || {};

  const handleDateClick = (day) => {
    if (isSameMonth(day, startOfMonth(currentMonth))) {
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
      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const bookingCount = bookingStats[dateKey] || 0;
          
          let statusClass = 'status-grey'; // Default/Non-working
          if (isSameMonth(day, monthStart)) {
             statusClass = bookingCount >= 3 ? 'status-red' : 'status-green';
          }

          return (
            <div
              className={`cell ${!isSameMonth(day, monthStart) ? 'disabled' : ''}`}
              key={index}
              onClick={() => handleDateClick(day)}
            >
              <span className="number">{format(day, 'd')}</span>
              {isSameMonth(day, monthStart) && (
                <span className={`status-dot ${statusClass}`}></span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="schedule-page">
      <div className="schedule-content">
        <div className="info-side">
          <h1 className="main-title">
            Book <br />
            <span className="script-font">Polomolok's</span>
            <br />
            <span className="sub-title">Finest Nails Today!</span>
          </h1>

          <div className="instructions">
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
          </div>
        </div>

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