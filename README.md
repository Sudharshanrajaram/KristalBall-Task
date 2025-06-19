# KristalBall-Task
# 🪖 Military Asset Management System

A comprehensive full-stack web application built to manage and monitor military assets (like vehicles, weapons, etc.) across multiple bases. This system supports asset purchases, transfers, expenditures, and real-time reporting with opening and closing balance tracking by base and asset type.

---

## 📽️ Walkthrough Video

🎥 **Watch the system walkthrough** (3–5 minutes)  
Includes:  
- System architecture overview  
- Core features in action  
- Manual handling of tricky flows (like filtered dashboard and cost-based balances)  
👉 [Video Link Here](#)

---

## 🔐 Demo Login Credentials

### 👨‍✈️ ADMIN  
**Email:** `admin@gmail.com`  
**Password:** **`admin123`**

### 🧭 BASE COMMANDER  
**Email:** `commander1@example.com`  
**Password:** **`password123`**

### 🧰 LOGISTIC OFFICER  
**Email:** `logi1@example.com`  
**Password:** **`test123`**

---

## ⚙️ Features

✅ **Authentication with JWT**  
✅ **Role-Based Access Control (RBAC)** for Admin, Base Commander, and Logistic Officer  
✅ Asset Management (Create, Edit, Delete)  
✅ Record and track:
- **Purchases** (with cost tracking)
- **Transfers** (between bases)
- **Expenditures** (with type, reason, and cost deduction)
✅ **Dynamic Dashboard:**
- Opening/Closing balances by base & asset type
- Net movement (cost-based)
- Recent transactions
- Filters by date, base, and equipment

✅ **Responsive Design** using Tailwind CSS  
✅ Full **MongoDB + Mongoose schema design**

---

## 🛠️ Tech Stack

| Layer       | Technology                  |
|------------|------------------------------|
| Frontend   | React.js, Tailwind CSS        |
| Backend    | Node.js, Express.js           |
| Database   | MongoDB, Mongoose             |
| Auth       | JWT, Role-based Middleware    |
| API Client | Axios                         |

---

## 📁 Folder Structure
├── Server/ # Node.js backend
│ ├── controllers/ # Route logic
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Route definitions
│ ├── middlewares/ # RBAC & JWT validation
│ └── server.js

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/military-asset-management.git
cd military-asset-management

