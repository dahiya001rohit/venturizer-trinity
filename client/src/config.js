// Always use the Vercel proxy in production to bypass Safari/Brave third-party cookie blocking.
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
export const API_URL = isLocalhost ? "http://localhost:4000" : "";
