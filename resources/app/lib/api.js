import axios from "axios";

// Configure axios defaults
axios.defaults.baseURL = CONFIG.api_base_url;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Profile API endpoints
export const profile = {
  updateGeneral: (data) =>
    axios.post("/profile", { ...data, action: "general" }),

  updatePassword: (data) =>
    axios.post("/profile", { ...data, action: "password" }),
};

// Auth API endpoints
export const auth = {
  login: (data) => axios.post("/auth/login", data),

  logout: () => axios.post("/auth/logout"),
};

// Users API endpoints
export const users = {
  index: (params) => axios.get("/users", { params }),

  create: (data) => axios.post("/users", data),

  update: (id, data) => axios.put(`/users/${id}`, data),

  delete: (id) => axios.delete(`/users/${id}`),
};
