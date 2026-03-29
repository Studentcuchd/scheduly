import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://scheduly-backend-n6ey.onrender.com/api").replace(/\/+$/, "");

export const eventTypeService = {
  getAll: () => axios.get(`${API_BASE}/events`),
  create: (data) => axios.post(`${API_BASE}/events`, data),
  update: (id, data) => axios.put(`${API_BASE}/events/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/events/${id}`),
  toggle: (id) => axios.patch(`${API_BASE}/events/${id}/toggle`),
};

export const availabilityService = {
  get: () => axios.get(`${API_BASE}/availability`),
  save: (data) => axios.put(`${API_BASE}/availability`, data),
};

export const bookingService = {
  getEvent: (username, slug) => axios.get(`${API_BASE}/public/${username}/${slug}`),
  getSlots: (username, slug, date) => axios.get(`${API_BASE}/slots/${username}/${slug}?date=${date}`),
  create: (username, slug, data) => axios.post(`${API_BASE}/book`, { ...data, username, slug }),
  getEventBySlugOnly: (slug) => axios.get(`${API_BASE}/booking/${slug}`),
  getSlotsBySlugOnly: (slug, date) => axios.get(`${API_BASE}/booking/${slug}/slots?date=${date}`),
  createBySlugOnly: (slug, data) => axios.post(`${API_BASE}/booking/${slug}`, data),
};

export const meetingService = {
  getAll: () => axios.get(`${API_BASE}/meetings`),
  cancel: (id) => axios.patch(`${API_BASE}/meetings/${id}/cancel`),
  remove: (id) => axios.delete(`${API_BASE}/meetings/${id}`),
};
