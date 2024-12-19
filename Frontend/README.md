# Automated PSV Seat Booking System

This project is built using **React**, **TypeScript**, **Redux**, and **Redux Persist** to provide a seamless and efficient platform for public service vehicle (PSV) seat booking.

## Tech Stack
- **React**: Frontend framework for building user interfaces.
- **TypeScript**: Enhances JavaScript with type safety.
- **Redux Toolkit**: Manages application state effectively.
- **Redux Persist**: Persists the Redux store for maintaining state across sessions.

---

## Setting Up the Project

### 1. Create a Vite Project with React and TypeScript
```bash
pnpm create vite@latest Frontend --template react-ts
cd Frontend
```
```bash
pnpm install
```

### 2. Install Redux Toolkit and Redux Persist
```bash
pnpm install @reduxjs/toolkit react-redux
pnpm install redux-persist
```

### 3. project structure
```bash
├── node_modules/
├── public/
├── src/
│   ├── app/
│   │   ├── store.ts
│   ├── features/
│   │   ├── counter/
│   │   │   ├── counterSlice.ts
│   │   ├── todo/
│   │   │   ├── userSlice.ts
│   │   │   ├── userApi.ts
│   │   │   ├── user.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md`
```

### 4. Run the Project
```bash
pnpm run dev
```
# Usage
- **Counter**: Demonstrates the use of Redux Toolkit to manage state.
- **Todo**: Fetches data from a mock API and displays it in a list.

### 5 clone the project
```bash
git clone https://github.com/Ngetich-86/AUTOMATED-PSV-SEAT-RESERVATION-SYSTEM.git
```
```bash
cd Frontend
```
```bash
pnpm install
```
```bash
pnpm run dev
```