# Student Task & Study Planner (MERN Stack)

A clean, straightforward Web Programming Laboratory mini-project built according to the **DJS23IPC203L** syllabus.

---

## Syllabus Unit Mapping

| Unit | Syllabus Topic | Implementation in this Project |
| :--- | :--- | :--- |
| **Unit 1** | **HTML & CSS Fundamentals** | Clean semantic HTML structure, responsive layout with flexbox and grid, custom styles in `client/src/index.css`. |
| **Unit 2** | **JavaScript (DOM & Logic)** | Asynchronous programming (`async`/`await`), state changes, array filtering and mapping, event handling. |
| **Unit 3** | **React.js & SPAs** | Component hierarchy (`Navbar`, `TaskCard`, `TaskFormModal`), client-side routing (`react-router-dom`), hooks (`useState`, `useEffect`, `useContext`). |
| **Unit 4** | **Node.js & Express.js** | Modular Express server (`server/server.js`), RESTful API routes (`taskRoutes.js`, `authRoutes.js`) supporting CRUD operations (**GET, POST, PUT, DELETE**). |
| **Unit 5** | **MongoDB & Mongoose** | NoSQL database integration using Mongoose models (`User` and `Task`), data validation, document references, and queries (`find`, `create`, `save`, `findOneAndDelete`). |
| **Unit 6** | **Integration & Authentication** | Connecting React frontend with Express backend via Axios REST calls; user authentication with **JWT (JSON Web Tokens)** and **bcryptjs** password hashing; protected routes. |

---

## Project Structure

```text
MiniProject/
├── package.json               # Root scripts
├── server/                    # Node.js + Express Backend
│   ├── models/
│   │   ├── User.js            # User model (name, email, password, branch, rollNumber)
│   │   └── Task.js            # Task model (title, subject, priority, status, dueDate)
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js      # Register and Login endpoints
│   │   └── taskRoutes.js      # CRUD task endpoints
│   ├── .env                   # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── server.js              # Express app & MongoDB connection
│   └── package.json           # Backend dependencies
└── client/                    # React Frontend (Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Top navigation bar
    │   │   ├── TaskCard.jsx        # Individual task card
    │   │   ├── TaskFormModal.jsx   # Add/Edit task modal form
    │   │   └── ProtectedRoute.jsx  # Route guard for authenticated users
    │   ├── context/
    │   │   └── AuthContext.jsx     # Authentication state and login/logout functions
    │   ├── pages/
    │   │   ├── Dashboard.jsx       # Tasks dashboard with search, filter, and stats
    │   │   ├── Login.jsx           # Student login page
    │   │   └── Register.jsx        # Student registration page
    │   ├── App.jsx                 # App routing
    │   ├── main.jsx                # React DOM entry point
    │   └── index.css               # Clean styling
    ├── index.html                  # HTML entry point
    ├── vite.config.js              # Vite configuration
    └── package.json                # Frontend dependencies
```

---

## How to Run the Project Locally

### Prerequisites
- Node.js installed (v18+)
- MongoDB running locally on port 27017 (or MongoDB Atlas URI)

### 1. Start the Backend Server
```bash
cd server
npm install
npm run dev
```
The server will start on **http://localhost:5001** and connect to MongoDB.

### 2. Start the Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The React frontend will start on **http://localhost:3000**.

---

## REST API Reference

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new student account
- `POST /api/auth/login` - Authenticate student and return a JWT token

### Task Routes (`/api/tasks`) *(Requires `Authorization: Bearer <token>`)*
- `GET /api/tasks` - Get all tasks for the logged-in student
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task
