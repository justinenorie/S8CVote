# 💻 S8CVote — Desktop Admin Application

**Event Voting Management System (Desktop Module)**  
Built with **Electron**, **React**, **Vite**, **TailwindCSS**, **SQLite** and **Supabase**

The Desktop App serves as the **central control hub** of the S8CVote system.  
It provides offline-first election management, student record administration, live vote monitoring, and secure syncing to the cloud (Supabase PostgreSQL).

This module is designed mainly for **Admins** and **School Election Committees**.

---

# 🚀 Features (Desktop Admin App)

### 📴 **Offline-First Local Database**

- Works fully without internet using **SQLite (better-sqlite3)**.
- Admins can:
  - Create, edit, and manage elections, candidates and partylist
  - Import student records
- All changes sync push automatically to **Supabase** when internet becomes available.

### 🔄 **Auto Sync Engine**

- Background syncing handles:
  - Elections
  - Candidates
  - Students
- Sync runs automatically when:
  - Network becomes online
  - Admin manually triggers sync

### 🗳️ **Election Management**

- Create elections with:
  - Title of Election
  - Election schedules (start/end)
- Activating/Closing elections
- Manage past elections and archive results

### 🧑‍🤝‍🧑 **Candidate & Partylist Management**

- Add, edit, delete candidates
- Upload candidate profiles
- Assign candidates to partylists
- Manage partylist colors, names, and acronyms

### 🎓 **Student Record Import**

- Import via **CSV** or **Excel**
- Auto-validation:
  - Duplicate student detection
  - Correct formatting checks
  - Missing Student ID prevention
- Used for voter authentication on Mobile & Web apps

### 📊 **Dashboard & Vote Monitoring**

- Displays:
  - Active elections
  - Real-time vote counts

### ⚙️ **Settings Module**

#### **General Tab**

- Update admin profile
- Change password
- Update name

#### **Admin Users Tab**

- View all current admins
- Accept or reject pending admin registrations
- Adds a secure verification layer before granting admin access

---

# 🧱 Tech Stack

### **Core**

- **ElectronJS** — Desktop application framework
- **Electron-Vite** — Bundling & development tooling
- **React** — UI library
- **TypeScript** — Type safety
- **Zod** — validation
- **React-Hook-Form** — form management

### **UI / Styling**

- **TailwindCSS**
- **Shadcn (React Components)**

### **Local Database**

- **SQLite** (using better-sqlite3)
- **Drizzle ORM** — Type-safe DB layer

### **Online Backend**

- **Supabase**
  - PostgreSQL
  - Auth
  - Row-Level Security
  - Functions and triggers
  - Realtime

---

## 💬 Acknowledgements

- Supabase for backend services
- Electron for cross-platform desktop support
- React + Vite for frontend rendering
- Drizzle for SQLite ORM
- TailwindCSS + Shadcn for UI

---
