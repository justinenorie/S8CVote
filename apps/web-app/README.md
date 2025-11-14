# 🌐 S8CVote — Web Application

**Event Voting Management System (Web Module)**  
Built with **Next.js**, **TailwindCSS**, **Shadcn UI**, and **Supabase**

S8CVote is a cross-platform Voting Management System designed for schools to conduct secure, efficient, and transparent student elections.  
This repository contains the **Web App**, intended for **students with internet access** and **public transparency**.

---

## 🚀 Features (Web App)

### 🧑‍🎓 **Student Registration & Verification**

- Students must register using their **Student ID**.
- Registration is only allowed if the student exists in the school’s official enrollment data.
- Prevents unauthorized users from creating fake accounts.

### 🗳️ **Online Voting**

- Accessible only **when online**.
- Students can log in and view **active elections** from the dashboard.
- Each election contains a list of candidates grouped by position.
- After submitting a vote:
  - It is stored instantly in the online PostgreSQL database (Supabase).
  - The student **cannot vote again** in the same election.
- Prevents duplicate voting system-wide.

### 📊 **Election Results & Transparency**

- Students and public users can view:
  - Current active election progress
  - Past elections grouped by **year → month**
- Results include:
  - Vote counts
  - Winning candidates
  - Candidate & partylist information

### 👤 **Student Profile Management**

- Students can update their **email** and **password** only.
- Full name & Student ID are locked (pulled from official records).

---

# 🧱 Tech Stack

### **Frontend**

- **Next.js**
- **React**
- **Tailwind CSS**
- **Shadcn UI**
- **Zod** (validation)
- **React-Hook-Form** (form management)
- **TypeScript** (type safety)

### **Backend**

- **Supabase (PostgreSQL)**

---

## 💬 Acknowledgements

- Supabase for backend, auth, and database services
- Next.js Team for framework support
- Shadcn UI for elegant UI component architecture
- React Native & Electron teams for cross-platform functionality

---
