
import React, { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  qualification: "",
};

function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showView, setShowView] = useState(false);
  
  // Display success and error messages
  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // Fetch teacher records from FastAPI
  const loadTeachers = useCallback(async () => {
    setLoading(true);

    try {
      const data = await api.getTeachers();

      if (!Array.isArray(data)) {
        throw new Error("Invalid teacher data received from backend.");
      }

      setTeachers(data);
      setMessage("");
    } catch (error) {
      showMessage(
        `Unable to load teachers: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  // Handle form input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Add or update teacher
  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    const teacherData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      qualification: formData.qualification.trim(),
    };

    // Required field validation
    if (Object.values(teacherData).some((value) => !value)) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(teacherData.email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(teacherData.phone)) {
      showMessage("Enter a valid 10-digit phone number.", "error");
      return;
    }

    setSaving(true);

    try {
      if (editingId !== null) {
        await api.updateTeacher(editingId, teacherData);
        showMessage("Teacher updated successfully!");
      } else {
        await api.createTeacher(teacherData);
        showMessage("Teacher added successfully!");
      }

      setFormData(initialForm);
      setEditingId(null);

      await loadTeachers();
    } catch (error) {
      showMessage(
        error.message || "Unable to save teacher.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  // Load teacher details into form for editing
  // Fetch teacher details and load them into the edit form
async function handleEdit(id) {
    try {
        setActionLoading(true);
        setMessage("");

        const teacher = await api.getTeacherById(id);

        setFormData({
            name: teacher.name || "",
            email: teacher.email || "",
            phone: teacher.phone || "",
            subject: teacher.subject || "",
            qualification: teacher.qualification || "",
        });

        setEditingId(teacher.id);

        setShowView(false);
        setSelectedTeacher(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    } catch (error) {
        showMessage(
            error.message || "Unable to fetch teacher details.",
            "error"
        );
    } finally {
        setActionLoading(false);
    }
}

  // Delete teacher
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed || saving) return;

    setSaving(true);

    try {
      await api.deleteTeacher(id);

      if (editingId === id) {
        setEditingId(null);
        setFormData(initialForm);
      }

      showMessage("Teacher deleted successfully!");

      await loadTeachers();
    } catch (error) {
      showMessage(
        error.message || "Unable to delete teacher.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  // Cancel editing
  function handleCancel() {
    setFormData(initialForm);
    setEditingId(null);
    setSelectedTeacher(null);
    setShowView(false);
    setMessage("");
  }

  // Search teachers
  const filteredTeachers = teachers.filter((teacher) => {
    const searchableText = [
      teacher.name,
      teacher.email,
      teacher.phone,
      teacher.subject,
      teacher.qualification,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(
      searchTerm.toLowerCase().trim()
    );
  });

  // Fetch and display a particular teacher
async function handleViewTeacher(id) {
    try {
        setActionLoading(true);
        setMessage("");

        const teacher = await api.getTeacherById(id);

        console.log("Particular Teacher Details:", teacher);

        setSelectedTeacher(teacher);
        setShowView(true);

    } catch (error) {
        console.error("Error viewing teacher:", error);

        showMessage(
            error.message || "Unable to fetch teacher details.",
            "error"
        );
    } finally {
        setActionLoading(false);
    }
}

  return (
    <div className="teacher-management">

      <h1>Teacher Management</h1>

      <p>Add, update, view, and manage teacher records.</p>

      {/* Teacher Summary */}
      <div className="teacher-summary">
        <div className="summary-card">
          <h3>{teachers.length}</h3>
          <p>Total Teachers</p>
        </div>
      </div>

      {/* Teacher Form */}
      <div className="teacher-form-card">

        <h2>
          {editingId !== null
            ? "Edit Teacher"
            : "Add New Teacher"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="teacher-form-grid">

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter teacher name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="teacher@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength={10}
                inputMode="numeric"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>

              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Mathematics"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="qualification">
                Qualification *
              </label>

              <input
                id="qualification"
                name="qualification"
                type="text"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. M.Sc Mathematics"
                required
              />
            </div>

          </div>

          {/* Success and Error Messages */}
          {message && (
            <p
              className={
                messageType === "error"
                  ? "form-message error-message"
                  : "form-message success-message"
              }
              role="status"
            >
              {message}
            </p>
          )}

          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Teacher"
                  : "Add Teacher"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>
     
     {/* View Selected Teacher */}
{showView && selectedTeacher && (
    <div className="teacher-view-card">
        <h2>Teacher Details</h2>

        <p><strong>Teacher ID:</strong> {selectedTeacher.id}</p>
        <p><strong>Name:</strong> {selectedTeacher.name}</p>
        <p><strong>Email:</strong> {selectedTeacher.email}</p>
        <p><strong>Phone:</strong> {selectedTeacher.phone}</p>
        <p><strong>Subject:</strong> {selectedTeacher.subject || "Not provided"}</p>
        <p><strong>Qualification:</strong> {selectedTeacher.qualification || "Not provided"}</p>

        <button
            type="button"
            onClick={() => {
                setShowView(false);
                setSelectedTeacher(null);
            }}
        >
            Close
        </button>
    </div>
)}
      {/* Teacher Records Table */}
      <div className="teacher-table-card">

        <div className="table-heading">

          <h2>Teacher Records</h2>

          <input
            type="search"
            className="search-input"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            aria-label="Search teachers"
          />

        </div>

        {loading ? (
          <p>Loading teachers...</p>
        ) : (
          <div className="table-responsive">

            <table className="data-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject</th>
                  <th>Qualification</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredTeachers.length > 0 ? (

                  filteredTeachers.map((teacher) => (

                    <tr key={teacher.id}>

                      <td>{teacher.id}</td>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.phone}</td>
                      <td>{teacher.subject}</td>
                      <td>{teacher.qualification}</td>

                      <td>
                        <div className="table-actions">

    <button
        type="button"
        className="view-button"
        onClick={() => handleViewTeacher(teacher.id)}
        disabled={actionLoading}
    >
        View
    </button>

    <button
        type="button"
        className="edit-button"
        onClick={() => handleEdit(teacher.id)}
        disabled={actionLoading}
    >
        Edit
    </button>

    <button
        type="button"
        className="delete-button"
        onClick={() => handleDelete(teacher.id)}
        disabled={actionLoading || saving}
    >
        Delete
    </button>

</div>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="7" className="empty-table">
                      {searchTerm
                        ? "No matching teachers found."
                        : "No teachers found. Add your first teacher above."}
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default ManageTeachers;
