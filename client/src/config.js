// If VITE_API_URL is explicitly set, use it.
// Otherwise, check if we are on Vercel (PROD) by checking if the host is not localhost.
// If not localhost, default to empty string so requests hit the /api proxy on Vercel.
// If localhost, default to the local backend on 4000.

const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const API_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : (isLocalhost ? "http://localhost:4000" : "");
