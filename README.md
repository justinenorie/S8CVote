# 🗳️ S8CVote: Voting Management System

**S8CVote** is a cross-platform Voting Management System developed as a capstone project for **Southville 8C National High School**. It focuses on administrators to organize elections, manage candidates, and tally results, while allowing the students to vote securely from web and mobile platforms — both online and offline.

---

## 🚀 Project Overview

S8CVote aims to modernize and streamline the election process within the school environment. The system supports real-time vote monitoring, offline mobile voting (room-to-room), secure authentication, and automated tallying with instant result generation.

---

## 📦 Tech Stack

| Category               | Technology/Tool                                                               |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Frontend (Web)**     | Next.js (React Framework), Tailwind CSS                                       |
| **Frontend (Mobile)**  | React Native, NativeWind                                                      |
| **Frontend (Desktop)** | ElectronJS (with React & Tailwind)                                            |
| **Backend**            | Node.js + Express, WebSocket (real-time), JWT (Auth), Prisma ORM              |
| **Database**           | PostgreSQL (main DB), SQLite (offline/local DB for mobile/desktop)            |
| **Authentication**     | JWT (access + refresh tokens), bcryptjs (password hashing)                    |
| **API Helpers**        | Axios (frontend), CORS, Cookie-parser                                         |
| **Logging & Dev**      | Morgan (HTTP logger), Nodemon (auto-reload), Dotenv (env vars), Typescript    |
| **Code Quality**       | ESLint (linter), Prettier (formatter), Git + GitHub (version control), VSCode |

---

## 📱 Features

### ✅ General (All Platforms)

- Secure user authentication
- Student ID verification (Only Full Name + Student ID required)
  - ✅ Must exist in database
  - ❌ Must not have already voted
- Vote duplication prevention through server-side validation
- Real-time voting results via WebSockets
- Offline voting supported with background sync
- Role-based access

---

### 🌐 Web App (For Students & Public Viewing)

- Login and vote using Student ID and Full Name
- Live vote count display for transparency
- Accessible from any browser with internet
- View candidate profiles and election details
- User-friendly dashboard for current/past election monitoring
- Generate statistics and view historical results (e.g., 2024, 2025)

---

### 🖥️ Desktop App (For Admins & System Setup)

- Acts as the **main controller** of the system
- Create/manage elections (council, themed events, etc.)
- Add/edit/delete candidates and assign per election
- Upload and manage student records via CSV/Excel
- View real-time votes with result analytics
- Generate downloadable reports (PDF/Excel)
- Configure election timelines and system settings
- Offline data storage using SQLite and syncing to PostgreSQL

---

### 📲 Mobile App (For Students without Devices & Admins in Rooms)

- Secure login for faculty/admin
- **Offline voting capability** (for students without devices)
- Syncs votes to central server when online
- Allows offline room-to-room collection by faculty using mobile/tablet
- Admin mobile features:
  - View real-time vote counts from anywhere
  - Manage elections (create, edit, or close)
  - See vote status: how many voted vs. pending
  - Manual vote approval (if needed)

---

## 🧩 System Modules

1. **Authentication Module**
   - Role-based login
   - JWT-based secure sessions
2. **Election Management Module**
   - Add/manage elections
   - Set active status and schedules
3. **Voting Module**
   - Cast and validate votes
   - Prevent duplicate voting
4. **Candidate Management**
   - Upload candidate details/photos
   - Assign per election
5. **Real-Time Result Tally**
   - WebSocket updates
   - Display graphs or vote count per candidate
6. **Report Generation**
   - Export vote summary (PDF/Excel)
   - Timestamped logs of voting activity

---

## 🔒 Security Practices

Security is a core focus of S8CVote, especially due to the sensitivity of voting data. The system includes the following mechanisms and protocols:

---

### ✅ User Authentication & Authorization

- **Secure Login:** Role-based authentication with secure credential storage
- **Password Hashing:** All passwords are hashed using `bcryptjs` before being stored in the database
- **JWT Tokens:** Stateless session management using JSON Web Tokens (JWT) for access and refresh tokens
- **Cookie-based Sessions:** Secure HTTP-only cookies for storing authentication tokens when needed
- **MFA (Multi-Factor Authentication):** Optional second layer of login verification for admin accounts (e.g., password + code)

---

### ✅ Voter Integrity & Validation

- **Voter Validation:** Verifies voter identity using Student ID + Full Name combination
- **Voter Qualification Rules:**
  - Student must exist in the uploaded records
  - Student must not have already voted
  - If validation passes, only then is voting allowed
- **Prevention of Duplicate Voting:** Once a vote is cast, the system flags the student as "voted" in the database
- **Vote Sync Auditing:** Offline votes are timestamped and validated before being committed to the online database

---

### ✅ Data Security

- **2-Level Encryption:**
  - ✅ **At Rest:** Data stored in the database (e.g., vote records) may be encrypted using algorithms like AES-256
  - ✅ **In Transit:** All network communication is encrypted using HTTPS (SSL/TLS)
- **AES-256 Encryption:** Industry-standard symmetric encryption used for securing sensitive offline vote data or local backups
- **Tokenization:** Sensitive identifiers (e.g., student records) can be tokenized to replace raw data with unique, non-sensitive tokens
- **Input Sanitization:** All user inputs are validated and sanitized to prevent injection attacks (SQLi, XSS)
- **CORS Headers & CSRF Protections:** Cross-Origin Resource Sharing is properly configured; CSRF protection added for web forms

---

### ✅ System Architecture

- **Application Isolation:** The backend, web frontend, desktop app, and mobile app are separated into modules. Each platform authenticates independently and interacts only through secure API endpoints.
- **Cross-Platform Security Consistency:** All platforms (web, desktop, mobile) use the same security principles: token-based auth, secure storage, encrypted transport, and role-based access

---

### ✅ Monitoring & Logs

- **Access Logs:** All requests logged via `Morgan`, with timestamps, routes, and user actions
- **Failed Login Monitoring:** Repeated failed attempts are tracked and can be locked or throttled
- **Audit Trails:** Admin actions (e.g., create/delete election) are logged for transparency

---

## 📄 Requirements

| Requirement      | Description                    |
| ---------------- | ------------------------------ |
| Node.js          | ^18.x or higher                |
| PostgreSQL       | 13 or higher                   |
| Mobile Platform  | Android 10+                    |
| Web Browsers     | Modern (Chrome, Firefox, Edge) |
| Desktop Platform | Windows 10+ (.exe installer)   |

---

## 🧑‍💻 Contributors

👤 **Justine Norie Dela Cruz**  
Capstone Developer, UI/UX Designer, and System Architect  
Colegio de Montalban, SY 2025–2026

---

## 💬 Acknowledgements

- Our instructors and mentors at Colegio de Montalban
- Southville 8C National High School teachers and staff
- Open-source community (React, Express, Prisma, etc.)

---

## 📌 License

This project is for academic purposes only. All rights reserved © 2025.

**_Note the information here is not final. It needs to modify once the capstone project is done._**
