// pages/sign-up-event.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SignUpEvent() {
  const [net_id, setNetId] = useState('');
  const [eventId, setEventId] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch available events
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        console.log('Fetched events:', data);

        if (response.ok && Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          console.error('Unexpected API response:', data);
          setEvents([]); // Fallback to empty array
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setEvents([]); // Fallback to empty array
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/sign-up-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, net_id }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Signed up for event successfully.');
        // Optionally, redirect to dashboard or update UI
        // router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to sign up for event.');
      }
    } catch (err) {
      console.error('Error signing up for event:', err);
      setError('An error occurred.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Sign Up for an Event</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="net_id"
          value={net_id}
          onChange={(e) => setNetId(e.target.value)}
          placeholder="Your Net ID"
          required
          className="w-full p-2 border"
        />
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          required
          className="w-full p-2 border"
        >
          <option value="">Select an Event</option>
          {Array.isArray(events) && events.map((event) => (
            <option key={event.event_id} value={event.event_id}>
              {event.event_name} on {new Date(event.date).toLocaleDateString()}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-purple-500 text-white p-2">
          Sign Up
        </button>
      </form>
    </div>
  );
}
