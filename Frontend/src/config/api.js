const env =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};

const browserHost =
  typeof window !== "undefined" ? window.location.hostname : "localhost";
const browserProtocol =
  typeof window !== "undefined" ? window.location.protocol : "http:";

const backendOrigin =
  env.VITE_BACKEND_ORIGIN ||
  `${browserProtocol}//${browserHost}:5000`;

const chatbotOrigin =
  env.VITE_CHATBOT_ORIGIN ||
  `${browserProtocol}//${browserHost}:5002`;

export const SOCKET_SERVER_URL =
  env.VITE_SOCKET_SERVER_URL || backendOrigin;

export const BOOKING_API_URL =
  env.VITE_BOOKING_API_URL || `${backendOrigin}/api/bookings`;

export const CHATBOT_API_URL =
  env.VITE_CHATBOT_API_URL || `${chatbotOrigin}/chat`;

export const LOGIN_API_URL =
  env.VITE_LOGIN_API_URL || `${backendOrigin}/api/auth/login`;

export const REGISTER_API_URL =
  env.VITE_REGISTER_API_URL || `${backendOrigin}/api/auth/register`;

export const ADMIN_LOGIN_API_URL =
  env.VITE_ADMIN_LOGIN_API_URL || `${backendOrigin}/api/admin/login`;

export const STAFF_LOGIN_API_URL =
  env.VITE_STAFF_LOGIN_API_URL || `${backendOrigin}/api/staff/login`;

export const STAFF_REGISTER_API_URL =
  env.VITE_STAFF_REGISTER_API_URL || `${backendOrigin}/api/staff/register`;

export const STAFF_DASHBOARD_API_URL =
  env.VITE_STAFF_DASHBOARD_API_URL || `${backendOrigin}/api/staff/dashboard`;

export const STAFF_MOBILITY_STREAM_URL =
  env.VITE_STAFF_MOBILITY_STREAM_URL || `${backendOrigin}/api/staff/mobility-stream`;

export const NOTIFICATIONS_API_URL =
  env.VITE_NOTIFICATIONS_API_URL || `${backendOrigin}/api/notifications`;

export const NOTIFICATIONS_STREAM_URL =
  env.VITE_NOTIFICATIONS_STREAM_URL || `${backendOrigin}/api/notifications/stream`;
