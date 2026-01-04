"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    program: "MBA 1",
    interestedActivities: [],
    experience: "No Experience",
    additionalInfo: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const activities = [
    "Football Competition (MBA 1 vs MBA 2)",
    "Track & Field Events (100m)",
    "Track & Field Events (200m)",
    "Track & Field Events (Sack Race)",
    "Chess & Draught Games",
    "Table Tennis",
    "Table Soccer",
    "Lawn Tennis",
    "Organizing/Setup",
    "Registration",
    "Medical Support",
    "Photography",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActivityToggle = (activity) => {
    setFormData((prev) => ({
      ...prev,
      interestedActivities: prev.interestedActivities.includes(activity)
        ? prev.interestedActivities.filter((a) => a !== activity)
        : [...prev.interestedActivities, activity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setMessageType("error");
        setMessage("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (formData.interestedActivities.length === 0) {
        setMessageType("error");
        setMessage("Please select at least one activity");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessageType("success");
        setMessage("✓ Your volunteer application has been submitted successfully!");

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          program: "MBA 1",
          interestedActivities: [],
          experience: "No Experience",
          additionalInfo: "",
        });

        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessageType("error");
        setMessage(data.message || "An error occurred while submitting the form");
      }
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Messages */}
      {message && (
        <div
          className={`flex gap-3 rounded-lg p-4 ${
            messageType === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Personal Information Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Personal Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="John"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="+234 901 000 0000"
            />
          </div>
        </div>
      </div>

      {/* Program Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Program Information
        </h3>
        <select
          name="program"
          value={formData.program}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option>MBA 1</option>
          <option>MBA 2</option>
          <option>Other</option>
        </select>
      </div>

      {/* Activities Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Interested Activities *
        </h3>
        <p className="mb-3 text-sm text-gray-600 font-medium">
          Select at least one activity you'd like to volunteer for:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {activities.map((activity) => (
            <label key={activity} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.interestedActivities.includes(activity)}
                onChange={() => handleActivityToggle(activity)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{activity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Volunteer Experience
        </h3>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option>No Experience</option>
          <option>Some Experience</option>
          <option>Extensive Experience</option>
        </select>
      </div>

      {/* Additional Information Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Additional Information
        </h3>
        <label className="block text-sm font-medium text-gray-700">
          Tell us anything else we should know about you
        </label>
        <textarea
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleInputChange}
          rows="4"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Any additional information..."
        />
      </div>
      
      {/* Alert Messages */}
      {message && (
        <div
          className={`flex gap-3 rounded-lg p-4 ${
            messageType === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader className="h-5 w-5 animate-spin" />
            Submitting...
          </span>
        ) : (
          "Submit Volunteer Application"
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        By submitting this form, you agree to volunteer for LASUMBA Games 2026
      </p>
    </form>
  );
}
