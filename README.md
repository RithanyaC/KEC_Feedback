# Placement Feedback Collection Portal

A role-based web application for managing and sharing placement interview experiences.

## Features
- **Admin**: User management, System analytics.
- **Coordinator**: Feedback moderation (Approve/Reject).
- **Student**: Submit experience, Browse insights, Download PDFs.

## Getting Started

### Prerequisites
- Node.js (v16+)
- NPM

### Installation

1. **Setup Server**
   ```bash
   cd server
   npm install
   # Create .env file with DATABASE_URL="file:./dev.db" and JWT_SECRET
   npx prisma db push
   node prisma/seed.js
   npm run dev
   ```

2. **Setup Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Default Login**
   - **Email**: `admin@college.edu`
   - **Password**: `admin123`

## Tech Stack
- React + Tailwind CSS
- Node.js + Express
- Prisma + SQLite
