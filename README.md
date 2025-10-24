# 🗳️ S8CVote: Voting Management System

**S8CVote** is a cross-platform Voting Management System developed as a capstone project for **Southville 8C National High School**. It enables administrators to organize elections, manage candidates, and tally results, while allowing students to vote securely via web, mobile, and desktop platforms — supporting both online and offline modes.

---

## 🚀 Project Overview

S8CVote modernizes and streamlines the school election process. It offers real-time vote monitoring, offline mobile voting for room-to-room setups, secure authentication, and automated vote tallying with instant result generation.

---

## 📦 Tech Stack

| Category               | Technology/Tool                                     |
| :--------------------- | :-------------------------------------------------- |
| **Frontend (Web)**     | Next.js (React), Tailwind CSS, Shadcn               |
| **Frontend (Mobile)**  | React Native, Nativewind                            |
| **Frontend (Desktop)** | ElectronJS with React, Tailwind CSS and Shadcn      |
| **Backend**            | Supabase                                            |
| **Database**           | PostgreSQL (online), SQLite (offline/local syncing) |
| **Validation**         | Zod, React-Hook-Form                                |
| **Development Tools**  | Typescript, VSCode, Git/Github, ESLint, Prettier    |

---

## 📱 Features

### ✅ General (Across All Platforms)

- Secure authentication and role-based access (students, admins, faculty)
- Student ID verification against official enrollment database
- Prevention of duplicate voting per election
- Offline-first voting with background automatic sync when online
- Real-time election results and transparency dashboards
- Admin verification process for new admin registrations

---

### 🌐 Web App (Students \& Public)

- Student registration and verification using Student ID
- Voting available online only with internet connection
- Clickable elections and candidate selection with vote submission
- Live election result dashboards, with historical data by year and month
- Public access for election results transparency
- Editable email and password for communication; locked Student ID and name

---

### 🖥️ Desktop App (Admins \& Event Setup)

- Central control hub supporting offline-first operation
- Manage elections, candidates, and schedule dates
- Import student voter lists via CSV/Excel to validate voters
- Dashboard for live vote tracking and election analytics
- Auto-sync data with Supabase when online
- Configure account and admin user management with approval workflow

---

### 📲 Mobile App (Admins \& Supervised Student Voting)

- Offline voting collection for students without devices (room-to-room)
- Faculty-admin supervised voting via mobile device
- Local storage of votes with automatic background syncing
- View live vote counts and election status remotely
- Secure login for admins before conducting voting sessions

---

## 🧩 Modules

1. **Authentication \& Authorization**
2. **Election and Candidate Management**
3. **Voting and Duplication Prevention**
4. **Real-time Vote Counting and Results**
5. **Reports and Analytics Generation**
6. **Admin User Management and Verification**

---

## 🔒 Security Measures

- Role-based secure login with hashed passwords (bcrypt)
- JWT-based token authentication with refresh mechanism
- Multi-factor authentication (MFA) via OTP for admins
- Validation enforcing unique vote per student per election
- Secure offline vote storage using encryption standards
- HTTPS encryption in network communication
- Input sanitization to prevent injection attacks
- Audit logging and monitoring of login and admin actions

---

## 📄 System Requirements

| Component          | Specification                                    |
| :----------------- | :----------------------------------------------- |
| Processor          | Intel® Core i3 or equivalent minimum            |
| RAM                | Minimum 4 GB                                     |
| Storage            | 10 GB free disk space                            |
| Operating System   | Windows 10 Pro or later (64-bit)                 |
| Internet           | Required for syncing and web access              |
| Development Device | Intel® Core i5-8250U, 16 GB RAM, Windows 11 Pro |

---

## 🧑‍💻 Contributors

👤 **Justine Norie Dela Cruz**
Capstone Developer, UI/UX Designer, System Architect
Colegio de Montalban, SY 2025–2026

---

## 💬 Acknowledgements

- Instructors and mentors at Colegio de Montalban
- Southville 8C National High School faculty and staff
- Open-source communities (React, Supabase, Tailwind, etc.)

---

## 📌 License

This project is for academic purposes only. All rights reserved © 2025.

**_Note: This documentation is provisional and subject to update upon project completion._**
