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

### **Shared Logic (Monorepo / Shared Library)**

- Supabase client
- Zod schemas
- Reusable components/patterns used across Mobile, Desktop, and Web

---

# ⚙️ Getting Started (Development)

### 1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/s8cvote-web.git
cd s8cvote-web

npm install
# or
yarn
# or
pnpm install
```

### 2. **Create your environment variables file**

Create a `.env.local` file with the following contents:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. **Run Development Server**

```bash
npm run dev

# open localhost:3000
```

## 💬 Acknowledgements

- Supabase for backend, auth, and database services
- Next.js Team for framework support
- Shadcn UI for elegant UI component architecture
- React Native & Electron teams for cross-platform functionality

---

## 📄 License

This project is part of the S8CVote — Event Voting Management System and is intended for academic and school-based use.

---
