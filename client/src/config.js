const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
export const API_URL = isLocalhost
  ? "http://localhost:4000"
  : (import.meta.env.VITE_API_URL || "");
