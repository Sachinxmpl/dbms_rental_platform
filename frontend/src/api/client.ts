import axios from "axios";

export const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// Auth
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => api.post("/auth/register", data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api
      .post("/auth/login", data)
      .then((r) => r.data as { token: string; user: import("../types").User }),
};

// Users
export const usersApi = {
  getMe: () => api.get("/users/me").then((r) => r.data),
  updateMe: (
    data: Partial<{ name: string; phone: string; avatarUrl: string }>,
  ) => api.patch("/users/me", data).then((r) => r.data),
  submitVerification: (governmentIdUrl: string) =>
    api.post("/users/me/verify", { governmentIdUrl }).then((r) => r.data),
  getPublicProfile: (id: string) => api.get(`/users/${id}`).then((r) => r.data),
};

// Items
export const itemsApi = {
  list: (params?: Record<string, string | number>) =>
    api
      .get("/items", { params })
      .then((r) => r.data as import("../types").PaginatedItems),
  getById: (id: string) =>
    api.get(`/items/${id}`).then((r) => r.data as import("../types").Item),
  create: (data: FormData | Record<string, unknown>) =>
    api.post("/items", data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/items/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/items/${id}`).then((r) => r.data),
};

// Rentals
export const rentalsApi = {
  create: (data: { itemId: string; startDate: string; endDate: string }) =>
    api.post("/rentals", data).then((r) => r.data),
  getMyRentals: (role: "renter" | "owner") =>
    api
      .get("/rentals", { params: { role } })
      .then((r) => r.data as import("../types").Rental[]),
  getById: (id: string) => api.get(`/rentals/${id}`).then((r) => r.data),
  updateStatus: (id: string, action: string, meta?: Record<string, unknown>) =>
    api.patch(`/rentals/${id}/status`, { action, ...meta }).then((r) => r.data),
};

// Reviews
export const reviewsApi = {
  create: (
    rentalId: string,
    data: { revieweeId: string; rating: number; comment?: string },
  ) => api.post(`/rentals/${rentalId}/reviews`, data).then((r) => r.data),
};
