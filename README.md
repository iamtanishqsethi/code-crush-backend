#  CodeCrush (Backend)

[🔗 Live Demo](https://code--crush.vercel.app/)  
[🖥️ Frontend Repository](https://github.com/iamtanishqsethi/code-crush-frontend)

**CodeCrush** is a developer-focused dating and social media platform. Whether you're looking for a pair programming partner or your forever co-founder, CodeCrush lets you match based on tech stack, showcase your projects, and chat in real-time.

---

## 🚀 Features

- **👩‍💻 Match by Tech Stack**  
  Find your perfect pair programmer based on tech compatibility.

- **📂 Share Projects**  
  Showcase your GitHub repos, blogs, or portfolio to share your coding personality.

- **💬 Real-time Geek Chat**  
  Dive into passionate conversations—from tabs vs. spaces to the latest JavaScript frameworks.

---

## 🗂️ File Structure
```
├── src/
│ ├── config/ 
│ │ └── database.js # MongoDB connection setup
│ ├── middlewares/ # Custom middleware
│ │ └── auth.js # JWT authentication
│ ├── models/ # Mongoose models
│ │ ├── chat.js
│ │ ├── ConnectionRequest.js
│ │ └── user.js
│ ├── routes/ # Express routes
│ │ ├── Auth.js
│ │ ├── Chat.js
│ │ ├── Profile.js
│ │ ├── Request.js
│ │ └── User.js
│ └── utils/ # Utility functions
│ ├── socket.js
│ └── validation.js
├── app.js # Main entry point
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## TechStack
- Node.js + Express
- MongoDb (mongoose)
- Jwt
- Validator
- Socket.io

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/iamtanishqsethi/code-crush-backend
   ```
2. Navigate to the project directory:
   ```bash
   cd code-crush-backend
   ```
3. Install dependencies:
   ```bash
   npm i 
   ```
4. Run the application:
   ```bash
   npm run dev
   ```
The app will be available at ```http://localhost:7777/```

