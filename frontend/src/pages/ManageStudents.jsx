import React, { useEffect, useState } from "react";

const STORAGE_KEY = "edumanage_students";

const emptyStudent = {
  admissionNo: "",
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  className: "",
  section: "",
  guardianName: "",
};

function ManageStudents() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState(emptyStudent);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const student = {
      admissionNo: formData.admissionNo.trim(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      className: formData.className,
      section: formData.section.trim().toUpperCase(),
      guardianName: formData.guardianName.trim(),
    };

    if (
      !student.admissionNo ||
      !student.name ||
      !student.email ||
      !student.phone ||
      !student.dateOfBirth ||
      !student.gender ||
      !student.className ||
      !student.section ||
      !student.guardianName
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(student.phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (student.dateOfBirth > new Date().toISOString().slice(0, 10)) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    const admissionExists = students.some(
      (item) =>
        item.admissionNo.toLowerCase() ===
          student.admissionNo.toLowerCase() &&
        item.id !== editingId
    );

    if (admissionExists) {
      setError("This admission number already exists.");
      return;
    }

    const emailExists = students.some(
      (item) =>
        item.email.toLowerCase() === student.email &&
        item.id !== editingId
    );

    if (emailExists) {
      setError("A student with this email already exists.");
      return;
    }

    if (editingId !== null) {
      setStudents((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...item, ...student }
            : item
        )
      );

      setSuccess("Student details updated successfully.");
    } else {
      const newStudent = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...student,
      };

      setStudents((previous) => [...previous, newStudent]);

      setSuccess("Student registered successfully.");
    }

    setFormData(emptyStudent);
    setEditingId(null);
  };

  const handleEdit = (student) => {
    setFormData({
      admissionNo: student.admissionNo,
      name: student.name,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      className: student.className,
      section: student.section,
      guardianName: student.guardianName,
    });

    setEditingId(student.id);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student record?"
    );

    if (!confirmed) return;

    setStudents((previous) =>
      previous.filter((student) => student.id !== id)
    );

    if (editingId === id) {
      setFormData(emptyStudent);
      setEditingId(null);
    }

    setError("");
    setSuccess("Student record deleted successfully.");
  };

  const handleCancel = () => {
    setFormData(emptyStudent);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const query = search.trim().toLowerCase();

  const filteredStudents = students.filter((student) =>
    [
      student.admissionNo,
      student.name,
      student.email,
      student.className,
      student.section,
    ].some((value) => value.toLowerCase().includes(query))
  );

  return (
    <div className="dashboard-container student-management">
      <div className="page-heading">
        <h1>Student Management</h1>
        <p>Register and manage school student records.</p>
      </div>

      <div className="teacher-summary">
        <div className="summary-card">
          <span>Total Students</span>
          <h2>{students.length}</h2>
        </div>

        <div className="summary-card">
          <span>Classes Represented</span>
          <h2>
            {
              new Set(
                students.map(
                  (student) =>
                    `${student.className}-${student.section}`
                )
              ).size
            }
          </h2>
        </div>
      </div>

      <section className="management-panel">
        <h2>
          {editingId !== null ? "Edit Student" : "Register New Student"}
        </h2>

        {error && (
          <div className="form-message error-message" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="form-message success-message" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="teacher-form-grid">
            <div className="form-group">
              <label htmlFor="admissionNo">Admission Number</label>
              <input
                id="admissionNo"
                name="admissionNo"
                value={formData.admissionNo}
                onChange={handleChange}
                placeholder="e.g. ADM2026001"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Student Full Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().slice(0, 10)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="className">Class</label>
              <select
                id="className"
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
              >
                <option value="">Select class</option>
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                ].map((className) => (
                  <option key={className} value={className}>
                    Class {className}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="section">Section</label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
              >
                <option value="">Select section</option>
                {["A", "B", "C", "D"].map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="guardianName">Parent/Guardian Name</label>
              <input
                id="guardianName"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                placeholder="Enter parent or guardian name"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              {editingId !== null ? "Update Student" : "Register Student"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="management-panel">
        <div className="table-heading">
          <div>
            <h2>Student Records</h2>
            <p>{filteredStudents.length} record(s) found</p>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="Search name, admission no., class..."
            aria-label="Search student records"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Admission No.</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Class</th>
                <th>Section</th>
                <th>Parent/Guardian</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="11" className="empty-table">
                    {students.length === 0
                      ? "No students registered yet."
                      : "No matching students found."}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.admissionNo}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.dateOfBirth}</td>
                    <td>{student.gender}</td>
                    <td>Class {student.className}</td>
                    <td>{student.section}</td>
                    <td>{student.guardianName}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ManageStudents;