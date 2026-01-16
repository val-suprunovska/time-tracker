# ⏱ Time Tracker App

A time-tracking application with daily limits, and clean UX for logging work hours across multiple projects.

---

## ✨ Features

- Add time entries by project
- Daily grouping of entries
- Daily & total hour calculation
- Delete entries
- Server-side daily hour limit (24h)
- Server-side validation (Zod)
- Clean error responses
- PostgreSQL persistence
- React + Zustand client state

---

## 🛠 Tech Stack

### **Frontend**
- React
- Zustand
- React Hook Form
- Axios
- date-fns
- Vite

### **Backend**
- Node.js
- Express
- Prisma
- PostgreSQL
- Zod
- Dayjs
- Custom error middleware

---

## 📦 Database Schema (Prisma)

```prisma
model TimeEntry {
  id          String   @id @default(uuid())
  date        DateTime
  project     String
  hours       Int
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
## 🚀 Getting Started
### 1. Clone repo  
```bash
git clone https://github.com/val-suprunovska/time-tracker.git
cd time-tracker
```
### 2. Install dependencies

**Client:**
```bash
cd client
npm install
```

**Server:**
```bash
cd server
npm install
```
## 🗄 Database Setup

Run migrations:
```bash
cd server
npx prisma migrate dev --name init

# Prisma client
npx prisma generate
```

## ▶ Running the App

### Start backend:
```bash
cd server
npm run dev
```

### Start frontend:
```bash
cd client
npm run dev
```