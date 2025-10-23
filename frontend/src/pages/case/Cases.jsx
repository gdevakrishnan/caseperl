import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../context/AppContext';
import {
  getAllCases,
  getCasesByUser,
  updateCaseStatus,
  deleteCase,
  STATUS_MAP
} from '../../serviceWorkers/caseServices';

// Filter Component
const CaseFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white/30 backdrop-blur-md p-4 rounded-lg shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Filter by Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Filter by Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Case Report Modal
const CaseReportModal = ({ caseData, onClose }) => {
  if (!caseData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-emerald-500 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Case Report</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-gray-600 font-medium">Case ID</label>
            <p className="text-gray-800 text-lg">#{caseData.id}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Title</label>
            <p className="text-gray-800 text-lg">{caseData.title}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Description</label>
            <p className="text-gray-800">{caseData.description || 'No description provided'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 font-medium">Status</label>
              <p className="text-gray-800 capitalize">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  caseData.status === 'resolved' || caseData.status === 'closed'
                    ? 'bg-green-100 text-green-800'
                    : caseData.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : caseData.status === 'new'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {caseData.status.replace('_', ' ')}
                </span>
              </p>
            </div>

            <div>
              <label className="text-gray-600 font-medium">Priority</label>
              <p className="text-gray-800">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  caseData.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : caseData.priority === 'medium'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {caseData.priority.charAt(0).toUpperCase() + caseData.priority.slice(1)}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 font-medium">Created Date</label>
              <p className="text-gray-800">
                {new Date(caseData.created_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="text-gray-600 font-medium">Updated Date</label>
              <p className="text-gray-800">
                {new Date(caseData.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {caseData.due_date && (
            <div>
              <label className="text-gray-600 font-medium">Due Date</label>
              <p className="text-gray-800">
                {new Date(caseData.due_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {caseData.resolution_summary && (
            <div>
              <label className="text-gray-600 font-medium">Resolution Summary</label>
              <p className="text-gray-800">{caseData.resolution_summary}</p>
            </div>
          )}

          <div>
            <label className="text-gray-600 font-medium">Assigned User ID</label>
            <p className="text-gray-800">{caseData.user}</p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-md bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Case Card Component
const CaseCard = ({ caseData, isAdmin, onViewReport, onStatusChange, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    await onStatusChange(caseData.id, newStatus);
    setIsUpdating(false);
  };

  const getPriorityDisplay = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {caseData.title}
          </h3>
          <p className="text-gray-600 text-sm">Case #{caseData.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          caseData.priority === 'high'
            ? 'bg-red-100 text-red-800'
            : caseData.priority === 'medium'
            ? 'bg-orange-100 text-orange-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {getPriorityDisplay(caseData.priority)}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">
        {caseData.description || 'No description'}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-600 text-sm">Status:</span>
        {isAdmin ? (
          <select
            value={caseData.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className="px-3 py-1 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300 disabled:bg-gray-100"
          >
            <option value="new">New</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
          </select>
        ) : (
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            caseData.status === 'resolved' || caseData.status === 'closed'
              ? 'bg-green-100 text-green-800'
              : caseData.status === 'in_progress'
              ? 'bg-blue-100 text-blue-800'
              : caseData.status === 'new'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {caseData.status.replace('_', ' ')}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onViewReport(caseData)}
          className="flex-1 py-2 px-4 rounded-md bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
        >
          View Report
        </button>
        {isAdmin && (
          <button
            onClick={() => onDelete(caseData.id)}
            className="py-2 px-4 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

// Main Cases Component
const Cases = () => {
  const { user } = useContext(AppContext);
  const { id, role } = user;

  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [selectedCase, setSelectedCase] = useState(null);

  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cases, filters]);

  const fetchCases = async () => {
    setLoading(true);
    setError('');
    try {
      const response = isAdmin
        ? await getAllCases()
        : await getCasesByUser(id);
      setCases(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cases];

    if (filters.status) {
      filtered = filtered.filter((c) => c.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter((c) => c.priority === filters.priority);
    }

    setFilteredCases(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleStatusChange = async (caseId, newStatus) => {
    try {
      const statusIndex = STATUS_MAP[newStatus];
      await updateCaseStatus(caseId, statusIndex);
      
      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      setError(err.message || 'Failed to update case status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (caseId) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;

    try {
      await deleteCase(caseId);
      setCases((prev) => prev.filter((c) => c.id !== caseId));
    } catch (err) {
      setError(err.message || 'Failed to delete case');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-emerald-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-700 font-medium">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {isAdmin && <CaseFilters filters={filters} onFilterChange={handleFilterChange} />}

        {filteredCases.length === 0 ? (
          <div className="bg-white/30 backdrop-blur-md p-12 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">No cases found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseData) => (
              <CaseCard
                key={caseData.id}
                caseData={caseData}
                isAdmin={isAdmin}
                onViewReport={setSelectedCase}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {selectedCase && (
          <CaseReportModal
            caseData={selectedCase}
            onClose={() => setSelectedCase(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Cases;