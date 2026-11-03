const API_BASE_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(
      typeof message === "string" ? message : JSON.stringify(message)
    );
  }

  return data;
}

const api = {
  getTeachers: () => request("/teachers/"),

  createTeacher: (teacher) =>
    request("/teachers/", {
      method: "POST",
      body: JSON.stringify(teacher),
    }),

  updateTeacher: (id, teacher) =>
    request(`/teachers/${id}`, {
      method: "PUT",
      body: JSON.stringify(teacher),
    }),

  deleteTeacher: (id) =>
    request(`/teachers/${id}`, {
      method: "DELETE",
    }),
};

export default api;