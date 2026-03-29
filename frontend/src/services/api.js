import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_URL || "https://scheduly-backend-n6ey.onrender.com").replace(/\/+$/, "");
const API_BASE = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;
const isDev = import.meta.env.DEV;

if (isDev) {
  console.log("API BASE:", API_BASE);
}

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  if (isDev) {
    const requestUrl = `${config.baseURL || ""}${config.url || ""}`;
    console.log("API CALL:", requestUrl);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = `${error?.config?.baseURL || ""}${error?.config?.url || ""}`;
    console.error("API ERROR:", { url: requestUrl, status, message: error?.message });
    return Promise.reject(error);
  }
);

export const eventTypeService = {
  getAll: () => apiClient.get(`/event-types`, { baseURL: API_BASE }),
  getBySlug: (slug) => apiClient.get(`/event-types/${slug}`, { baseURL: API_BASE }),
  create: (data) => apiClient.post(`/event-types`, data, { baseURL: API_BASE }),
  update: (id, data) => apiClient.put(`/event-types/${id}`, data, { baseURL: API_BASE }),
  delete: (id) => apiClient.delete(`/event-types/${id}`, { baseURL: API_BASE }),
  toggle: (id) => apiClient.patch(`/event-types/${id}/toggle`, null, { baseURL: API_BASE }),
};

export const availabilityService = {
  get: () => apiClient.get(`/availability`, { baseURL: API_BASE }),
  save: (data) => apiClient.put(`/availability`, data, { baseURL: API_BASE }),
};

export const bookingService = {
  getEvent: (username, slug) => apiClient.get(`/public/${username}/${slug}`, { baseURL: API_BASE }),
  getSlots: (username, slug, date) => apiClient.get(`/slots/${username}/${slug}`, { baseURL: API_BASE, params: { date } }),
  create: (username, slug, data) =>
    apiClient.post(`/book`, { ...data, username, slug }, { baseURL: API_BASE }),
  getEventBySlugOnly: (slug) => apiClient.get(`/booking/${slug}`, { baseURL: API_BASE }),
  getSlotsBySlugOnly: (slug, date) =>
    apiClient.get(`/booking/${slug}/slots`, { baseURL: API_BASE, params: { date } }),
  createBySlugOnly: (slug, data) => apiClient.post(`/booking/${slug}`, data, { baseURL: API_BASE }),
};

export const meetingService = {
  getAll: () => apiClient.get(`/meetings`, { baseURL: API_BASE }),
  cancel: (id) => apiClient.patch(`/meetings/${id}/cancel`, null, { baseURL: API_BASE }),
  remove: (id) => apiClient.delete(`/meetings/${id}`, { baseURL: API_BASE }),
};
