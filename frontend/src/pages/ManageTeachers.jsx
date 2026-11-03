import React, { useCallback, useEffect, useState } from "react";
import api from "../services/api";

function ManageTeachers() {
  const initialForm = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
  };

  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // Fetch teacher records from FastAPI
  const loadTeachers = useCallback(async () => {
    setLoading(true);

    try {
      const data = await api.getTeachers();
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

  // Add or update a teacher
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

    if (
      !teacherData.name ||
      !teacherData.email ||
      !teacherData.phone ||
      !teacherData.subject ||
      !teacherData.qualification
    ) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherData.email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

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
      showMessage(error.message || "Unable to save teacher.", "error");
    } finally {
      setSaving(false);
    }
  }

  // Load a teacher into the form
  function handleEdit(teacher) {
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.subject,
      qualification: teacher.qualification,
    });

    setEditingId(teacher.id);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Delete a teacher from PostgreSQL
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) return;

    try {
      await api.deleteTeacher(id);

      if (editingId === id) {
        setEditingId(null);
        setFormData(initialForm);
      }

      showMessage("Teacher deleted successfully!");
      await loadTeachers();
    } catch (error) {
      showMessage(error.message || "Unable to delete teacher.", "error");
    }
  }

  // Cancel editing
  function handleCancel() {
    setFormData(initialForm);
    setEditingId(null);
    setMessage("");
  }

  // Search teachers
  const filteredTeachers = teachers.filter((teacher) => {
    const searchableText = [
      teacher.name,
      teacher.email,
      teacher.subject,
      teacher.qualification,
      teacher.phone,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase().trim());
  });

  return (
    <div className="teacher-management">
      <h1>Teacher Management</h1>
      <p>Add, update, view, and manage teacher records.</p>

      <div className="teacher-summary">
        <div className="summary-card">
          <h3>{teachers.length}</h3>
          <p>Total Teachers</p>
        </div>
      </div>

      <div className="teacher-form-card">
        <h2>{editingId !== null ? "Edit Teacher" : "Add New Teacher"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="teacher-form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
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
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Mathematics"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="qualification">Qualification *</label>
              <input
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. M.Sc Mathematics"
                required
              />
            </div>
          </div>

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

      <div className="teacher-table-card">
        <div className="table-heading">
          <h2>Teacher Records</h2>

          <input
            type="search"
            className="search-input"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
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
                            className="edit-button"
                            onClick={() => handleEdit(teacher)}
                            disabled={saving}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleDelete(teacher.id)}
                            disabled={saving}
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