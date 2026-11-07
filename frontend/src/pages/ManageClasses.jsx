import React, { useEffect, useState } from "react";

function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ingId, setingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const initialForm = {
    className: "",
    section: "A",
    academicYear: "2026-2027",
    classTeacher: "",
    roomNumber: "",
  };

  const [formData, setFormData] = useState(initialForm);

  // Load classes and teachers from localStorage
  useEffect(() => {
    try {
      const savedClasses = JSON.parse(
        localStorage.getItem("edumanage_classes") || "[]"
      );

      const savedTeachers = JSON.parse(
        localStorage.getItem("edumanage_teachers") || "[]"
      );

      setClasses(Array.isArray(savedClasses) ? savedClasses : []);
      setTeachers(Array.isArray(savedTeachers) ? savedTeachers : []);
    } catch (error) {
      console.error("Error loading class data:", error);
      setClasses([]);
      setTeachers([]);
      showMessage("Unable to load saved data.", "error");
    }
  }, []);

  // Display success or error message
  function showMessage(text, type = "success") {
    setMessage(text);
    setMessageType(type);
  }

  // Update form fields
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Save classes to localStorage
  function saveClasses(updatedClasses) {
    try {
      localStorage.setItem(
        "edumanage_classes",
        JSON.stringify(updatedClasses)
      );

      setClasses(updatedClasses);
      return true;
    } catch (error) {
      console.error("Error saving classes:", error);
      showMessage("Unable to save class data.", "error");
      return false;
    }
  }

  // Add a new class or update an existing class
  function handleSubmit(event) {
    event.preventDefault();

    const normalizedClass = formData.className.trim();
    const normalizedYear = formData.academicYear.trim();
    const normalizedRoom = formData.roomNumber.trim();

    if (!normalizedClass || !normalizedYear) {
      showMessage("Please enter the class and academic year.", "error");
      return;
    }

    if (!/^(?:[1-9]|1[0-2])$/.test(normalizedClass)) {
      showMessage("Please enter a class from 1 to 12.", "error");
      return;
    }

    if (!/^\d{4}-\d{4}$/.test(normalizedYear)) {
      showMessage("Enter the academic year in YYYY-YYYY format.", "error");
      return;
    }

    const [startYear, endYear] = normalizedYear.split("-").map(Number);

    if (endYear !== startYear + 1) {
      showMessage(
        "The academic year must contain consecutive years, such as 2026-2027.",
        "error"
      );
      return;
    }

    const duplicate = classes.some(
      (item) =>
        item.id !== ingId &&
        item.className === normalizedClass &&
        item.section === formData.section &&
        item.academicYear.toLowerCase() === normalizedYear.toLowerCase()
    );

    if (duplicate) {
      showMessage(
        "This class, section, and academic year already exist.",
        "error"
      );
      return;
    }

    const classRecord = {
      id: ingId || Date.now().toString(),
      className: normalizedClass,
      section: formData.section,
      academicYear: normalizedYear,
      classTeacher: formData.classTeacher || "",
      roomNumber: normalizedRoom,
    };

    let updatedClasses;

    if (ingId) {
      updatedClasses = classes.map((item) =>
        item.id === ingId ? classRecord : item
      );
    } else {
      updatedClasses = [...classes, classRecord];
    }

    if (saveClasses(updatedClasses)) {
      setFormData(initialForm);
      setingId(null);

      showMessage(
        ingId
          ? "Class updated successfully!"
          : "Class added successfully!"
      );
    }
  }

  // Load a class into the form for ing
  function handle(classRecord) {
    setFormData({
      className: classRecord.className,
      section: classRecord.section,
      academicYear: classRecord.academicYear,
      classTeacher: classRecord.classTeacher || "",
      roomNumber: classRecord.roomNumber || "",
    });

    setingId(classRecord.id);
    showMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete a class
  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmed) return;

    const updatedClasses = classes.filter((item) => item.id !== id);

    if (saveClasses(updatedClasses)) {
      if (ingId === id) {
        handleCancel();
      }

      showMessage("Class deleted successfully!");
    }
  }

  // Cancel ing
  function handleCancel() {
    setFormData(initialForm);
    setingId(null);
    showMessage("");
  }

  // Search classes
  const filteredClasses = classes.filter((item) => {
    const searchableText = [
      item.className,
      item.section,
      item.academicYear,
      item.classTeacher,
      item.roomNumber,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase().trim());
  });

  return (
    <div className="class-management">
      <div className="class-page-header">
        <div>
          <h1>Class &amp; Section Management</h1>
          <p>Create classes, manage sections, and assign class teachers.</p>
        </div>
      </div>

      <div className="class-summary">
        <div className="class-summary-card">
          <h3>{classes.length}</h3>
          <p>Total Class Sections</p>
        </div>

        <div className="class-summary-card">
          <h3>{new Set(classes.map((item) => item.className)).size}</h3>
          <p>Classes</p>
        </div>

        <div className="class-summary-card">
          <h3>
            {classes.filter((item) => item.classTeacher).length}
          </h3>
          <p>Assigned Class Teachers</p>
        </div>
      </div>

      <div className="class-form-card">
        <h2>{ingId ? " Class" : "Add New Class"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="class-form-grid">
            <div className="class-form-group">
              <label htmlFor="className">Class *</label>

              <select
                id="className"
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>

                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={String(index + 1)}>
                    Class {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="class-form-group">
              <label htmlFor="section">Section *</label>

              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
              >
                {["A", "B", "C", "D", "E"].map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
            </div>

            <div className="class-form-group">
              <label htmlFor="academicYear">Academic Year *</label>

              <input
                id="academicYear"
                type="text"
                name="academicYear"
                placeholder="2026-2027"
                value={formData.academicYear}
                onChange={handleChange}
                pattern="\d{4}-\d{4}"
                title="Enter the academic year like 2026-2027"
                required
              />
            </div>

            <div className="class-form-group">
              <label htmlFor="classTeacher">Class Teacher</label>

              <select
                id="classTeacher"
                name="classTeacher"
                value={formData.classTeacher}
                onChange={handleChange}
              >
                <option value="">Unassigned</option>

                {teachers.map((teacher, index) => {
                  const teacherName = teacher.name || teacher.fullName;

                  if (!teacherName) return null;

                  return (
                    <option
                      key={teacher.id || teacher.email || index}
                      value={teacherName}
                    >
                      {teacherName}
                    </option>
                  );
                })}
              </select>

              {teachers.length === 0 && (
                <small>
                  Add teachers in Teacher Management to assign them here.
                </small>
              )}
            </div>

            <div className="class-form-group">
              <label htmlFor="roomNumber">Room Number</label>

              <input
                id="roomNumber"
                type="text"
                name="roomNumber"
                placeholder="e.g. 101"
                value={formData.roomNumber}
                onChange={handleChange}
                maxLength={20}
              />
            </div>
          </div>

          {message && (
            <p
              className={`class-message ${
                messageType === "error" ? "class-error" : "class-success"
              }`}
              role="status"
            >
              {message}
            </p>
          )}

          <div className="class-form-actions">
            <button type="submit" className="class-primary-button">
              {ingId ? "Update Class" : "Add Class"}
            </button>

            {ingId && (
              <button
                type="button"
                className="class-secondary-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="class-table-card">
        <div className="class-table-header">
          <h2>Class Records</h2>

          <input
            type="search"
            className="class-search"
            placeholder="Search class, section, teacher..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search class records"
          />
        </div>

        <div className="class-table-responsive">
          <table className="class-data-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Section</th>
                <th>Academic Year</th>
                <th>Class Teacher</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredClasses.length > 0 ? (
                filteredClasses.map((item) => (
                  <tr key={item.id}>
                    <td>Class {item.className}</td>
                    <td>{item.section}</td>
                    <td>{item.academicYear}</td>
                    <td>{item.classTeacher || "Unassigned"}</td>
                    <td>{item.roomNumber || "—"}</td>

                    <td>
                      <div className="class-table-actions">
                        <button
                          type="button"
                          className="class--button"
                          onClick={() => handle(item)}
                        >
                          
                        </button>

                        <button
                          type="button"
                          className="class-delete-button"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="class-empty-table">
                    {searchTerm
                      ? "No matching classes found."
                      : "No classes added yet. Use the form above to add a class."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageClasses;