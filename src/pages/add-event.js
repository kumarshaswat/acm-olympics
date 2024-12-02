// pages/add-event.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddEvent() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    event_name: '',
    date: '',
    points_possible: 0, // Assuming you want to include this field
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // For handling form submission state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to format datetime-local value to 'YYYY-MM-DD HH:MM:SS'
  const formatDateForMySQL = (datetimeLocal) => {
    if (!datetimeLocal) return '';
    // Split the datetime-local value into date and time
    const [datePart, timePart] = datetimeLocal.split('T');
    // Append seconds
    return `${datePart} ${timePart}:00`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Basic client-side validation
    if (!formData.event_name || !formData.date || !formData.points_possible) {
      setError('Event name, date, and points possible are required.');
      setIsSubmitting(false);
      return;
    }

    // Format date for MySQL
    const formattedDate = formatDateForMySQL(formData.date);

    try {
      const response = await fetch('/api/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: formData.event_name,
          date: formattedDate, // Send the correctly formatted date
          points_possible: parseInt(formData.points_possible, 10),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Event added successfully!');
        // Optionally, redirect to another page
        // router.push('/events');
        // Reset form
        setFormData({
          event_name: '',
          date: '',
          points_possible: 0,
        });
      } else {
        setError(data.error || 'Failed to add event.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl mb-4">Add New Event</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="event_name" className="block text-sm font-medium text-gray-700">
            Event Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="event_name"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter event name"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Event Date and Time<span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="points_possible" className="block text-sm font-medium text-gray-700">
            Points Possible<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="points_possible"
            name="points_possible"
            value={formData.points_possible}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter points possible"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-2 rounded-md transition-colors duration-300 ${
            isSubmitting
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Adding Event...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
}
