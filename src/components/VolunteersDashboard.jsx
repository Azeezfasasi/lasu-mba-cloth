"use client";

import { useState, useEffect } from "react";
import { Trash2, MessageSquare, Check, X, Loader, Search, Filter, Download } from "lucide-react";

export default function VolunteersDashboard() {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteMessage, setNoteMessage] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  // Fetch volunteers
  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const url =
        statusFilter === "all"
          ? "/api/volunteer"
          : `/api/volunteer?status=${statusFilter}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setVolunteers(data.volunteers);
        filterVolunteers(data.volunteers, searchQuery);
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/volunteer/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Filter volunteers based on search
  const filterVolunteers = (list, query) => {
    let filtered = list;

    if (query) {
      filtered = filtered.filter(
        (v) =>
          v.firstName.toLowerCase().includes(query.toLowerCase()) ||
          v.lastName.toLowerCase().includes(query.toLowerCase()) ||
          v.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredVolunteers(filtered);
  };

  useEffect(() => {
    fetchVolunteers();
    fetchStats();
  }, [statusFilter]);

  useEffect(() => {
    filterVolunteers(volunteers, searchQuery);
  }, [searchQuery, volunteers]);

  // Handle status change
  const handleStatusChange = async (volunteerId, newStatus) => {
    try {
      const response = await fetch(`/api/volunteer/${volunteerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStatus", status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setVolunteers((prev) =>
          prev.map((v) =>
            v._id === volunteerId ? { ...v, status: newStatus } : v
          )
        );
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Handle delete
  const handleDelete = async (volunteerId) => {
    if (!confirm("Are you sure you want to delete this volunteer?")) return;

    try {
      const response = await fetch(`/api/volunteer/${volunteerId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setVolunteers((prev) => prev.filter((v) => v._id !== volunteerId));
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting volunteer:", error);
    }
  };

  // Handle add note
  const handleAddNote = async () => {
    if (!noteMessage.trim()) return;

    try {
      const response = await fetch(`/api/volunteer/${selectedVolunteer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addNote",
          message: noteMessage,
          adminId: "admin_id_here", // Replace with actual admin ID from session
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSelectedVolunteer(data.volunteer);
        setNoteMessage("");
        setShowNoteModal(false);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredVolunteers.length === 0) {
      alert("No volunteers to export");
      return;
    }

    // CSV Header
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Program",
      "Experience",
      "Status",
      "Activities",
      "Additional Info",
      "Submitted Date",
    ];

    // CSV Rows
    const rows = filteredVolunteers.map((volunteer) => [
      volunteer.firstName,
      volunteer.lastName,
      volunteer.email,
      volunteer.phone,
      volunteer.program,
      volunteer.experience,
      volunteer.status,
      volunteer.interestedActivities.join("; "),
      volunteer.additionalInfo || "",
      new Date(volunteer.submittedAt).toLocaleString(),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma or quote
            const escaped = String(cell).replace(/"/g, '""');
            return escaped.includes(",") || escaped.includes('"')
              ? `"${escaped}"`
              : escaped;
          })
          .join(",")
      ),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `LASUMBA_Volunteers_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-[90%] lg:w-full">
      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-600">Total Volunteers</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="rounded-lg bg-white p-4 sm:p-6 shadow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="rounded-lg bg-white shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No volunteers found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 hidden md:table-cell">
                    Program
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer._id} className="border-b hover:bg-gray-50 text-xs sm:text-sm">
                    <td className="px-3 sm:px-6 py-4 font-medium text-gray-900">
                      <div>
                        {volunteer.firstName} {volunteer.lastName}
                      </div>
                      <div className="text-gray-600 text-xs sm:hidden">
                        {volunteer.email}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-700 hidden sm:table-cell">
                      {volunteer.email}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-700 hidden md:table-cell">
                      {volunteer.program}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(
                          volunteer.status
                        )}`}
                      >
                        {volunteer.status.charAt(0).toUpperCase() +
                          volunteer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex gap-1 sm:gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setSelectedVolunteer(volunteer);
                            setShowDetailModal(true);
                          }}
                          className="rounded bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 text-xs"
                          title="View details"
                        >
                          👁️
                        </button>

                        <button
                          onClick={() => {
                            setSelectedVolunteer(volunteer);
                            setShowNoteModal(true);
                          }}
                          className="rounded bg-purple-100 p-2 text-purple-600 hover:bg-purple-200"
                          title="Add note"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>

                        <select
                          value={volunteer.status}
                          onChange={(e) =>
                            handleStatusChange(volunteer._id, e.target.value)
                          }
                          className="rounded border border-gray-300 px-2 py-1 text-xs sm:text-sm text-gray-700"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>

                        <button
                          onClick={() => handleDelete(volunteer._id)}
                          className="rounded bg-red-100 p-2 text-red-600 hover:bg-red-200"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Volunteer Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">First Name</p>
                  <p className="font-medium text-gray-900">
                    {selectedVolunteer.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Name</p>
                  <p className="font-medium text-gray-900">
                    {selectedVolunteer.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">
                    {selectedVolunteer.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">
                    {selectedVolunteer.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-medium text-gray-900">
                    {selectedVolunteer.program}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium text-gray-900">
                    {selectedVolunteer.experience}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(
                      selectedVolunteer.status
                    )}`}
                  >
                    {selectedVolunteer.status.charAt(0).toUpperCase() +
                      selectedVolunteer.status.slice(1)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Interested Activities</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedVolunteer.interestedActivities.map((activity) => (
                    <span
                      key={activity}
                      className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {selectedVolunteer.additionalInfo && (
                <div>
                  <p className="text-sm text-gray-600">Additional Information</p>
                  <p className="mt-1 text-gray-900">
                    {selectedVolunteer.additionalInfo}
                  </p>
                </div>
              )}

              {selectedVolunteer.adminNotes && selectedVolunteer.adminNotes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-600">Admin Notes</p>
                  <div className="mt-2 space-y-2">
                    {selectedVolunteer.adminNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700"
                      >
                        <p className="font-medium">
                          {note.createdBy?.firstName} {note.createdBy?.lastName}
                        </p>
                        <p className="mt-1">{note.message}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500">
                Submitted: {new Date(selectedVolunteer.submittedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add Note</h2>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                </p>
                <p className="text-sm text-gray-600">{selectedVolunteer.email}</p>
              </div>

              <textarea
                value={noteMessage}
                onChange={(e) => setNoteMessage(e.target.value)}
                placeholder="Write your note here..."
                rows="4"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
