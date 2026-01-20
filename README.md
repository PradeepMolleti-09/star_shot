⭐ StarShot – AI Photo Matching Platform

StarShot is a web application that helps people find their photos automatically from an event using face recognition.

📸 Cameramen upload event photos

🧍 Fans scan a QR code and upload a selfie

🤖 AI finds matching photos and shows them to the fan

☁️ Photos are stored securely in the cloud

🚀 Features
👤 Authentication

Register & Login (JWT + Cookies)

Role-based access (Cameraman / Admin)

Secure logout

🎉 Event Management

Create events

Generate QR codes for events

Each user sees only their own events

📸 Photo Upload (Cameraman)

Upload multiple photos at once

Drag & drop support

Upload progress bar

Skeleton loaders while loading

Delete photos (also deletes from database & Cloudinary)

🤳 Fan Experience

Scan QR code

Upload selfie

AI matches face with event photos

Confidence score shown for each match

Download matched photos

🧠 AI Face Matching

Face detection using TensorFlow.js

Face descriptors stored in database

Matching based on confidence threshold

🛠️ Tech Stack
Frontend

React + Vite

Tailwind CSS

React Router

Framer Motion (animations)

Axios

React Toastify

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Multer (file uploads)

AI & Media

TensorFlow.js

Cloudinary (image storage)

📂 Project Structure
StarShot/
│
├── client/        # Frontend (React)
│
├── server/        # Backend (Node + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
├── face-Engine/   # For Face Recognition
└── README.md

🔐 Authentication Flow

User logs in → JWT stored in HTTP-only cookie

/auth/me checks if user is logged in

Protected routes redirect to login if not authenticated

📸 Photo Upload Flow

Cameraman creates an event

Uploads event photos

Faces are detected and stored

Event QR code is generated

🤳 Fan Matching Flow

Fan scans QR code

Uploads a selfie

AI extracts face data

Matches selfie with event photos

Shows only high confidence matches

🧹 Photo Deletion

Deleting a photo:

Removes it from UI

Deletes from MongoDB

Deletes from Cloudinary

Undo delete supported (soft delete)

✨ UI & UX Enhancements

Smooth page animations

Skeleton loaders

Toast notifications

Responsive design

Clean dashboard layout

🔒 Security

Passwords hashed using bcrypt

JWT authentication

Protected routes

CORS configured

Cookies secured

📌 Future Improvements

Admin analytics dashboard

Faster AI processing

Paid downloads

Face clustering

Event expiration automation

🙌 Author

Pradeep Molleti
B.Tech – Computer Science
Passionate about AI, Full-Stack Development & Real-World Applications

⭐ If You Like This Project

Give it a ⭐ on GitHub
It really helps and motivates 🚀
