// Centralized API base URL for all backend requests.
//
// In production (Vercel), this defaults to "/api" which routes
// through the Vercel rewrite to the backend Flask service.
//
// In local development, set VITE_API_URL in frontend/.env
// to point to your local Flask server, e.g.:
//   VITE_API_URL=http://127.0.0.1:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default API_BASE_URL;
