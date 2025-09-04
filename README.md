# 🏗️ API Playground Project

A full-stack web application for managing user profiles.

---

## 🌐 Architecture

### **Frontend**

* Built with **React.js**
* Deployed on **Vercel**
* Uses environment variable `REACT_APP_API_URL` to connect with backend

### **Backend**

* **Node.js** + **Express** server
* Deployed on **Render**
* Connects to **MongoDB Atlas**
* Provides **RESTful API endpoints** (e.g., `/profile/profile`)

### **Database**

* **MongoDB Atlas** (cloud-hosted)
* Stores **user profiles** and related data

---

## ⚙️ Setup Instructions

### 🔹 Local Setup

#### **Clone Repository**

```bash
git clone <repo-url>
cd <project-folder>
```

#### **Backend**

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGODB_URI=<your-mongodb-uri>
PORT=5000
```

Start the server:

```bash
npm start
```

#### **Frontend**

```bash
cd frontend
npm install
```

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 🔹 Production Setup

#### **Backend**

* Deploy on **Render**
* Set environment variable: `MONGODB_URI`
* Render will assign a public backend URL
  Example: `https://api-playground-backend-1.onrender.com`

#### **Frontend**

* Deploy on **Vercel**
* Set environment variable:

```env
REACT_APP_API_URL=https://api-playground-backend-1.onrender.com
```

* Vercel will serve the frontend
  Example: `https://api-playground-frontend.vercel.app`

---

## 🗄️ Database Schema

### **Profile Schema (Mongoose / MongoDB)**

```javascript
const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  education: String,
  skills: [String],
  experience: String
});
```

---

## 📡 Sample Requests

### **Using `curl`**

* **Get all profiles**

```bash
curl -X GET https://api-playground-backend-1.onrender.com/profile/profile
```

* **Add a profile**

```bash
curl -X POST https://api-playground-backend-1.onrender.com/profile/profile \
-H "Content-Type: application/json" \
-d '{
  "name": "Arsh Gupta",
  "email": "arshg0080@gmail.com",
  "education": "BTech in Information Technology",
  "skills": ["React", "Node.js", "MongoDB"]
}'
```

### **Using Postman**

* `GET /profile/profile` → Fetch all profiles
* `POST /profile/profile` → Add new profile

---

## ⚠️ Known Limitations

* ❌ **No authentication/authorization** (open API)
* ❌ **No input validation** → backend may accept malformed data
* ❌ **Minimal error handling** (404s, JSON parse errors)
* ⚙️ **CORS setup** may need adjustment depending on deployment
* 🕒 Free-tier Render/Vercel → backend may **spin down on inactivity** (cold starts)

---

Made with ❤️ using **React.js**, **Node.js**, and **MongoDB Atlas**
