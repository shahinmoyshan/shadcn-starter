import axios from "axios";

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
