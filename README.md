# 🧹 Clean Street

A community-driven platform where citizens can report local civic issues, volunteers resolve them, and admins oversee everything — all in one place.

> *"Your one step can make our street spotless."*

---

## 🚀 Features

- 📍 **Report Issues** — Submit complaints with photo, priority, and GPS location
- 🔄 **Real-time Tracking** — Follow complaint status from `received` → `in_review` → `resolved`
- 🙋 **Volunteer System** — Volunteers accept and resolve assigned complaints
- 🗳️ **Community Voting** — Upvote/downvote issues to highlight urgency
- 💬 **Comments** — Discuss issues on complaint threads
- ⭐ **Feedback & Ratings** — Rate volunteers after resolution
- 🔔 **Notifications** — Alerts for assignments, status changes, and feedback
- 🛡️ **Admin Dashboard** — Manage users, complaints, feedback, and export reports

---

## 🛠️ Tech Stack

**Frontend** — React 19, Vite, Tailwind CSS, Framer Motion, React Router, Leaflet, Recharts, Axios

**Backend** — Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs


---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/clean-street.git
cd "clean-street"
```

### 2. Backend

```bash
cd backend
npm install
npm run dev       # http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

---

## 🔐 Environment Variables

**`backend/.env`**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000
```

---

## 👥 User Roles

| Role | Access |
|---|---|
| `user` | Report issues, vote, comment, give feedback |
| `volunteer` | Accept & resolve complaints, view own ratings |
| `admin` | Full access — manage users, complaints, export reports |

---

## 📄 License

This project is licensed under the MIT License.
