// src/config.ts
export const ApiDomain = process.env.NODE_ENV === 'production'
  ? 'https://backenc-automated-psvbs-deployment.onrender.com/' // Change to your actual production URL
  : 'https://backenc-automated-psvbs-deployment.onrender.com/'; // Local development URL
