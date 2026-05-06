#  Job Portal Application

A full-stack Job Portal web application where users can search and apply for jobs, and recruiters can post and manage job listings. The platform also includes email notifications using Nodemailer.

---

##  Features

###  For Job Seekers

* Register & login
* Browse available jobs
* Apply for jobs
* Receive email notifications after applying

###  For Recruiters

* Post new jobs
* Update & delete job listings
* View applicants

###  Email Notifications

* Email sent on:

  * Job application submission
  * Account registration (optional)
* Implemented using **Nodemailer**

---

##  Tech Stack

### Frontend

* HTML, CSS, JavaScript
* react.js , tailwind.css

### Backend

* Node.js
* Express.js

### Database

* MongoDB (with Mongoose)

### Other Tools

* Nodemailer (for email notifications)
* Git & GitHub


##  Project Structure

```
job-portal/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── public/
│
├── .env
├── package.json
└── README.md
```

---

##  Installation & Setup
###  Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file in the backend folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

---

## Running the Project

### Start Backend

```bash
cd backend
npm run aditya
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## Deployment

* Backend: Render / Railway / Heroku
* Frontend: Vercel / Netlify
* Database: MongoDB Atlas

---

## Future Enhancements
* to add virtual interview platform 
* Real-time notifications
* Ai mock Interview feature to prepare for interview 

---

##  Developer 

Aditya Bhadauria

---

⭐ If you like this project, don’t forget to give it a star!
