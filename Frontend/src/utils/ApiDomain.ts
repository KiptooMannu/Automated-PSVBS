// src/config.ts
export const ApiDomain = process.env.NODE_ENV === 'production'
  ? 'https://backenc-automated-psvbs-deployment.onrender.com/' 
  : 'https://backenc-automated-psvbs-deployment.onrender.com/'; 
