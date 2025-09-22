📝 Authentication & Post Management App

This project is a Node.js + Express + MongoDB application that provides user authentication, post creation, likes, and profile management features.

🚀 Features

User signup with bcrypt password hashing

User login with JWT authentication (stored in cookies)

Secure session handling with cookie-parser

Create, edit, and like posts

Profile page with user’s posts

Dashboard showing all posts with user info

Logout functionality

🛠 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ODM)

Authentication: JWT, bcrypt

Templating Engine: EJS

Others: cookie-parser

📂 Project Structure
.
├── models/
│   ├── user.js        # User schema & model
│   ├── post.js        # Post schema & model
├── views/
│   ├── signup.ejs     # Signup page
│   ├── login.ejs      # Login page
│   ├── dashboard.ejs  # Dashboard with posts
│   ├── profile.ejs    # User profile
├── public/            # Static assets (CSS, JS, images)
├── app.js             # Main application file
└── package.json

⚙️ Installation & Setup

Clone the repo

git clone https://github.com/your-username/your-repo.git
cd your-repo


Install dependencies

npm install


Set up environment variables
Create a .env file in the project root and add:

MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
PORT=3000


In the provided code, MongoDB URI and secret are hardcoded. For production, move them into .env.

Run the server

npm start


or for development with auto-reload:

npx nodemon app.js


Open your browser at:

http://localhost:3000

🔑 API Endpoints
Authentication

POST /signup → Create a new user

POST /login → Login existing user

POST /logout → Logout user

User

GET /profile → Get logged-in user profile (JSON)

GET /profile-page → Render profile page

GET /dashboard → Render dashboard with posts

Posts

POST /posts → Create new post

POST /editpost/:id → Edit a post

POST /likes/:id → Like a post

🛡️ Middleware

isloggedIn → Verifies JWT token from cookies before granting access to protected routes.

📌 Notes

Default secret is hardcoded as helloguys. Change this for security.

Currently, isloggedIn redirects to /login-page if token is missing/invalid.

Add validation and error handling for production use.

📷 Screens

/signup-page → Signup form

/login-page → Login form

/dashboard → Posts feed

/profile-page → User’s profile

📜 License

This project is licensed under the MIT License.
