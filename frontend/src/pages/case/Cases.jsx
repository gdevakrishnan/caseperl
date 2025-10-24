import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../context/AppContext';
import { Plus, Filter, Eye, Trash2, Clock, AlertCircle, Edit, TrendingUp, FileText, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getAllCases,
  getCasesByUser,
  updateCaseStatus,
  deleteCase,
  updateCase,
  STATUS_MAP
} from '../../serviceWorkers/caseServices';

// Filter Component
const CaseFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-800 transition-all"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-800 transition-all"
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

// Edit Case Modal
const EditCaseModal = ({ caseData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: caseData.title || '',
    description: caseData.description || '',
    status: caseData.status || 'new',
    priority: caseData.priority || 'medium',
    due_date: caseData.due_date ? caseData.due_date.split('T')[0] : '',
    resolution_summary: caseData.resolution_summary || '',
    user: caseData.user
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AppContext);
  const { role } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate(caseData.id, formData);
      onClose();
    } catch (error) {
      console.error('Failed to update case:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Case</h2>
              <p className="text-gray-500 text-sm mt-1">Case #{caseData.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={user.id !== formData.user}
              className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none 
        focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
        ${user.id !== formData.user ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter case title"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              disabled={user.id !== formData.user}
              className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none 
        focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none 
        ${user.id !== formData.user ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter case description"
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={user.id !== formData.user}
                className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none 
          focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white 
          ${user.id !== formData.user ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                disabled={user.id !== formData.user}
                className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none 
          focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
          ${user.id !== formData.user ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          {/* ✅ Visible only for Admin */}
          {role === 'admin' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-emerald-500 
            focus:border-transparent bg-white"
                >
                  <option value="new">New</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="reopened">Reopened</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resolution Summary
                </label>
                <textarea
                  name="resolution_summary"
                  value={formData.resolution_summary}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-emerald-500 
            focus:border-transparent resize-none"
                  placeholder="Enter resolution summary (optional)"
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-lg bg-emerald-600 text-white font-semibold 
                 hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg 
                 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
              1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Case'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Case Report Modal
const CaseReportModal = ({ caseData, onClose }) => {
  if (!caseData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-linear-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Case Report</h2>
              <p className="text-emerald-100 text-sm mt-1">Case #{caseData.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <label className="text-emerald-700 font-semibold text-sm">Title</label>
            <p className="text-gray-900 text-lg mt-1">{caseData.title}</p>
          </div>

          <div>
            <label className="text-gray-600 font-semibold text-sm block mb-2">Description</label>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              {caseData.description || 'No description provided'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="text-gray-600 font-semibold text-sm block mb-2">Status</label>
              <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold ${caseData.status === 'resolved' || caseData.status === 'closed'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : caseData.status === 'in_progress'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : caseData.status === 'new'
                    ? 'bg-gray-200 text-gray-700 border border-gray-300'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}>
                {caseData.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="text-gray-600 font-semibold text-sm block mb-2">Priority</label>
              <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold ${caseData.priority === 'high'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : caseData.priority === 'medium'
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-gray-200 text-gray-700 border border-gray-300'
                }`}>
                {caseData.priority.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="text-gray-600 font-semibold text-sm block mb-1">Created Date</label>
              <p className="text-gray-800">
                {new Date(caseData.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="text-gray-600 font-semibold text-sm block mb-1">Updated Date</label>
              <p className="text-gray-800">
                {new Date(caseData.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {caseData.due_date && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <label className="text-amber-700 font-semibold text-sm block mb-1">Due Date</label>
              <p className="text-amber-900">
                {new Date(caseData.due_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {caseData.resolution_summary && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <label className="text-green-700 font-semibold text-sm block mb-2">Resolution Summary</label>
              <p className="text-gray-700">{caseData.resolution_summary}</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="text-gray-600 font-semibold text-sm block mb-1">User ID</label>
            <p className="text-gray-800 font-mono">{caseData.user}</p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Case Card Component
const CaseCard = ({ caseData, isAdmin, onViewReport, onStatusChange, onDelete, onEdit }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    await onStatusChange(caseData.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      {/* Color indicator based on priority */}
      <div className="p-6 pl-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-gray-200 transition-colors">
                <AlertCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  {caseData.title}
                </h3>
                <p className="text-gray-500 text-sm">Case #{caseData.id}</p>
              </div>
            </div>
          </div>

          {/* Action buttons in top right */}
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(caseData)}
              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Edit case"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(caseData.id)}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              title="Delete case"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {caseData.description || 'No description provided'}
        </p>

        <div className="flex items-center gap-2 mb-4 pb-4">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 text-xs">
            {new Date(caseData.created_at).toLocaleDateString()}
          </span>
          <span className={`ml-auto px-2.5 py-1 rounded-md text-xs font-semibold ${caseData.priority === 'high'
            ? 'bg-red-100 text-red-700'
            : caseData.priority === 'medium'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-emerald-100 text-emerald-700'
            }`}>
            {caseData.priority.toUpperCase()}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <label className="text-gray-600 text-sm font-medium block">Status</label>
          <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${caseData.status === 'resolved' || caseData.status === 'closed'
            ? 'bg-green-100 text-green-700 border border-green-200'
            : caseData.status === 'in_progress'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : caseData.status === 'new'
                ? 'bg-gray-200 text-gray-700 border border-gray-300'
                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
            }`}>
            {caseData.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <button
          onClick={() => onViewReport(caseData)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-sm hover:shadow-md"
        >
          <Eye className="w-4 h-4" />
          View Full Report
        </button>
      </div>
    </div>
  );
};

// Main Cases Component
const Cases = () => {
  const { user } = useContext(AppContext);
  const nav = useNavigate();
  const { id, role } = user;

  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [selectedCase, setSelectedCase] = useState(null);
  const [editingCase, setEditingCase] = useState(null);

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

  const handleUpdate = async (caseId, formData) => {
    try {
      // Use the case's user ID, not the logged-in user's ID
      await updateCase(caseId, editingCase.user, formData);

      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, ...formData } : c))
      );

      setEditingCase(null);
    } catch (err) {
      setError(err.message || 'Failed to update case');
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

  const handleEdit = (caseData) => {
    setEditingCase(caseData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-end items-center mb-2">
            <button
              onClick={() => nav('/new-case')}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              New Case
            </button>
          </div>

          {/* Stats Bar - Light theme with colored left border */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm font-medium">Total Cases</p>
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{cases.length}</p>
              <p className="text-gray-500 text-xs mt-1">All registered cases</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <div className="bg-orange-50 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {cases.filter(c => c.status === 'in_progress').length}
              </p>
              <p className="text-gray-500 text-xs mt-1">Currently being worked on</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm font-medium">Resolved</p>
                <div className="bg-green-50 p-2 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {cases.filter(c => c.status === 'resolved' || c.status === 'closed').length}
              </p>
              <p className="text-gray-500 text-xs mt-1">Successfully completed</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        {isAdmin && <CaseFilters filters={filters} onFilterChange={handleFilterChange} />}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">No cases found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or create a new case</p>
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
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        {/* View Report Modal */}
        {selectedCase && (
          <CaseReportModal
            caseData={selectedCase}
            onClose={() => setSelectedCase(null)}
          />
        )}

        {/* Edit Case Modal */}
        {editingCase && (
          <EditCaseModal
            caseData={editingCase}
            onClose={() => setEditingCase(null)}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Cases;