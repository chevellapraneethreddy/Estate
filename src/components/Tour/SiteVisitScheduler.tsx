import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarIcon, CheckIcon } from '../Common/Icons';

interface SiteVisitSchedulerProps {
  propertyName: string;
  onSuccess?: () => void;
}

export const SiteVisitScheduler: React.FC<SiteVisitSchedulerProps> = ({ propertyName, onSuccess }) => {
  const { bookVisit } = useApp();

  // Contact state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Date/Time states
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  // UI states
  const [booked, setBooked] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate next 7 days starting from today
  const getDates = () => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      
      dates.push({
        isoString: `${yyyy}-${mm}-${dd}`,
        dayName: days[d.getDay()],
        dayNum: d.getDate(),
        monthName: months[d.getMonth()]
      });
    }
    return dates;
  };

  const timeSlots = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM'
  ];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !selectedDate || !selectedSlot) {
      setError('Please fill in your details and select a date and time slot.');
      return;
    }

    setError(null);
    bookVisit({
      leadName: name,
      leadPhone: phone,
      propertyName: propertyName,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'confirmed'
    });

    setBooked(true);
    if (onSuccess) {
      setTimeout(() => onSuccess(), 2500);
    }
  };

  const activeDates = getDates();

  return (
    <div className="card" style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
      {booked ? (
        <div style={{ textAlign: 'center', padding: '30px 10px' }} className="animate-fade-in">
          <div style={{
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            border: '2px solid var(--color-primary)',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <CheckIcon size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>Site Visit Booked!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Your appointment at <b>{propertyName}</b> is confirmed for:
          </p>
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            maxWidth: '300px',
            margin: '0 auto',
            fontSize: '0.9rem',
            fontWeight: 700
          }}>
            <span>📅 {selectedDate}</span>
            <span>🕒 {selectedSlot}</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '16px' }}>
            A confirmation brochure link has been sent to <b>{phone}</b> via WhatsApp.
          </p>
        </div>
      ) : (
        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <CalendarIcon size={20} style={{ color: 'var(--color-primary)' }} />
              Schedule a Site Visit
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Select your slot to inspect the property in person.
            </p>
          </div>

          {error && (
            <div style={{ background: 'var(--color-danger)', color: '#fff', padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {/* Date Selector Row */}
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Select Date *
            </span>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
              {activeDates.map((d) => {
                const isActive = selectedDate === d.isoString;
                return (
                  <button
                    key={d.isoString}
                    type="button"
                    onClick={() => setSelectedDate(d.isoString)}
                    style={{
                      flex: '0 0 70px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '10px 4px',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--color-primary)' : 'var(--border-color)',
                      background: isActive ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                      color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.8 }}>{d.dayName}</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, margin: '2px 0' }}>{d.dayNum}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{d.monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots Selector Grid */}
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Select Time Slot *
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {timeSlots.map((slot) => {
                const isActive = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '10px',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--color-primary)' : 'var(--border-color)',
                      background: isActive ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                      color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      textAlign: 'center'
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Contact Details
            </span>

            <div className="form-group" style={{ marginBottom: '8px' }}>
              <input 
                type="text" 
                placeholder="Full Name *"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <input 
                  type="email" 
                  placeholder="Email Address *"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
              </div>

              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <input 
                  type="tel" 
                  placeholder="Phone Number *"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{
              padding: '10px',
              fontSize: '0.9rem',
              width: '100%',
              marginTop: '6px'
            }}
          >
            Confirm Site Visit
          </button>
        </form>
      )}
    </div>
  );
};
