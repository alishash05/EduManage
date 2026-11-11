const API_BASE_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {

    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,

        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
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
            typeof message === "string"
                ? message
                : JSON.stringify(message)
        );
    }

    return data;
}

const api = {
  // Authentication APIs
  registerUser: (user) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    }),

  verifyRegistrationOTP: (otpData) =>
    request("/auth/verify-registration-otp", {
      method: "POST",
      body: JSON.stringify(otpData),
    }),

  resendRegistrationOTP: (data) =>
  request("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  loginUser: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // Teacher APIs
  getTeachers: () => request("/teachers/"),

  //teacher by Ids
  getTeacherById: (id) => 
    request(`/teachers/${id}`),

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

  // Student APIs
  getStudents: () => request("/students/"),

  getStudentById: (id) =>
  request(`/students/${id}`),
};

export default api;