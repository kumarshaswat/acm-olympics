import { useState } from 'react';

export default function DeleteRecordsPage() {
  const [deleteType, setDeleteType] = useState('student');
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    let endpoint;
    switch (deleteType) {
      case 'student':
        endpoint = '/api/delete-student';
        break;
      case 'event':
        endpoint = '/api/delete-event';
        break;
      case 'event_signup':
        endpoint = '/api/delete-event-signup';
        break;
      default:
        return setErrorMessage('Invalid delete type selected.');
    }

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setFormData({});
      } else {
        setErrorMessage(data.error || 'Failed to delete record.');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Delete Records</h1>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleDelete} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Select Type to Delete</label>
          <select
            value={deleteType}
            onChange={(e) => setDeleteType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="student">Student</option>
            <option value="event">Event</option>
            <option value="event_signup">Event Signup</option>
          </select>
        </div>

        {deleteType === 'student' && (
          <div>
            <label className="block mb-2 font-medium">Student Net ID</label>
            <input
              type="text"
              placeholder="Enter student net_id"
              value={formData.net_id || ''}
              onChange={(e) =>
                setFormData({ ...formData, net_id: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}

        {deleteType === 'event' && (
          <div>
            <label className="block mb-2 font-medium">Event ID</label>
            <input
              type="number"
              placeholder="Enter event ID"
              value={formData.event_id || ''}
              onChange={(e) =>
                setFormData({ ...formData, event_id: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}

        {deleteType === 'event_signup' && (
          <>
            <div>
              <label className="block mb-2 font-medium">Student Net ID</label>
              <input
                type="text"
                placeholder="Enter student net_id"
                value={formData.net_id || ''}
                onChange={(e) =>
                  setFormData({ ...formData, net_id: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Event ID</label>
              <input
                type="number"
                placeholder="Enter event ID"
                value={formData.event_id || ''}
                onChange={(e) =>
                  setFormData({ ...formData, event_id: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Delete Record
        </button>
      </form>
    </div>
  );
}
