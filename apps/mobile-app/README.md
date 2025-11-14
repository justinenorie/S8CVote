# 📱 S8CVote — Mobile Application

**Event Voting Management System (Mobile Module)**  
Built with **Expo**, **React Native**, **NativeWind**, **Zustand**, and **SQLite**

The Mobile App is designed for **Admins** and **Supervised Student Voting**, especially for **room-to-room offline voting** where internet access is limited.  
It supports **full offline mode** using SQLite and syncs to Supabase PostgreSQL when the device goes online.

---

# 🚀 Features (Mobile App)

### 📴 **Offline-First Voting**

- Detects network connectivity automatically:
  - **Offline** → Saves votes & data to **SQLite**
  - **Online** → Saves directly to **Supabase**
- All offline records sync **automatically** when connection is restored.

### 🧑‍🏫 **Admin-Supervised Room-to-Room Voting**

- Students vote using the admin's mobile device to prevent unauthorized voting.
- Voting process:
  1. Student enters Student ID
  2. System validates if they are enrolled
  3. Checks if the student already voted for that election
  4. Student selects candidates and submits vote
  5. Prevents duplicate voting

### 🗳️ **Elections List**

- Displays all active elections.
- Each election includes:
  - Candidates
  - Candidate images
  - Partylist info
  - Position ordering

### 🔁 **Auto Sync Engine**

- Runs in the background when:
  - Network becomes online
  - App starts
  - Admin triggers manual sync
- Syncs:
  - Elections
  - Candidates
  - Students
  - Votes
- Uses conflict-safe logic to prevent double votes.

### 📊 **Results Transparency (Mobile View)**

- View:
  - Current active elections
  - Past election results
- Includes vote counts, winners, and partylists.

### ⚙️ **Admin Tools**

- Secure admin login
- Track sync status
- Local + Server data monitoring
- Logout & session clearing

---

# 🧱 Tech Stack

### **Core**

- **Expo (React Native)**
- **TypeScript**
- **Expo Router** (file-based routing)
- **Zustand** – global state management
- **NativeWind** – Tailwind-like styling
- **React Native Reanimated** (if animations exist)
- **Zod** (validation)
- **React-Hook-Form** (form management)

### **Offline Database**

- **SQLite (expo-sqlite or better-sqlite3)**  
  Used for:
  - Election records
  - Local votes
  - Student data
  - Sync metadata

### **Online Backend**

- **Supabase**
  - PostgreSQL
  - Auth
  - Row-Level Security
  - Functions & triggers

---

## 💬 Acknowledgements

- Expo Team for the robust cross-platform ecosystem
- Supabase for backend/database services
- React Native Community for open-source contributions
- Zustand & NativeWind for making state management and styling simple

---
