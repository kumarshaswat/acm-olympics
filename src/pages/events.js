// pages/events.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { parseISO, format } from 'date-fns';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all events with pagination
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/events?page=${pagination.page}&limit=${pagination.limit}`);
        const data = await response.json();

        if (response.ok) {
          // Check if events are returned as an array
          if (Array.isArray(data.events)) {
            setEvents(data.events);
          } else if (typeof data.events === 'object') {
            // Convert object to array if necessary
            const eventsArray = Object.values(data.events);
            setEvents(eventsArray);
          } else {
            setError('Unexpected data format received.');
          }
          setPagination(data.pagination);
          setError('');
        } else {
          setError(data.error || 'Failed to fetch events.');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [pagination.page, pagination.limit]);

  const handlePrevious = () => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  };

  const handleNext = () => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages),
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Link
        href="/add-event"
        className="bg-blue-500 text-white px-4 py-2 rounded-md inline-block mb-6 hover:bg-blue-600 transition-colors duration-300"
      >
        Add New Event
      </Link>
      <div>
        {isLoading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <>
            <ul className="space-y-6">
              {events.map((event) => (
                <li
                  key={event.event_id}
                  className="border p-6 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <h2 className="text-2xl font-semibold mb-2">{event.event_name}</h2>
                  <p className="text-gray-600 mb-2">
                    Date: {event.date ? format(parseISO(event.date), 'MMMM do, yyyy \'at\' h:mm a') : 'Date not set'}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Points Possible: {event.points_possible !== undefined ? event.points_possible : 'N/A'}
                  </p>
                  {/* If there are additional fields like description, include them here */}
                  {/* {event.description && <p className="text-gray-700">{event.description}</p>} */}
                </li>
              ))}
            </ul>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePrevious}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-md ${
                  pagination.page === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={pagination.page === pagination.totalPages}
                className={`px-4 py-2 rounded-md ${
                  pagination.page === pagination.totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
