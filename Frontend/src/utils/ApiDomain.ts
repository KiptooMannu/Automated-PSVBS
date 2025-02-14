// src/config.ts
export const ApiDomain = process.env.NODE_ENV === 'production'
  ? 'https://your-production-domain.com/' // Change to your actual production URL
  : 'http://localhost:8081/'; // Local development URL
