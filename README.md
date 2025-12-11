# online-course-management-system
Full-stack Course Management System built with Spring Boot, MySQL, and HTML/CSS/JS

# Student Result & Attendance Management System (SMS)



---

## 🚀 Features

- **Authentication**
  - Secure login with JWT
  - Admin dashboard access

- **Student Management**
  - Add, edit, delete student records
  - View student list with roll numbers, classes, and sections

- **Attendance Tracking**
  - Mark daily attendance
  - View attendance history per student

- **Result Management**
  - Enter subject marks
  - Auto‑calculate grades
  - Generate student report cards

- **Reports & Analytics**
  - KPI dashboard (total students, average attendance, pass percentage)
  - Charts and visualizations
  - Export reports to CSV

---

## 🛠 Tech Stack

**Backend**
- Node.js + Express
- SQLite3
- JWT Authentication
- dotenv, bcrypt, cors

**Frontend**
- HTML, CSS, JavaScript
- Responsive dashboard UI
- Fetch API integration with backend

---

## 📂 Project Structure
student-sms/ ├── Backend/ │   ├── server.js │   ├── db.js │   ├── schema.sql │   ├── seed.sql │   ├── package.json │   └── .env └── Frontend/ ├── index.html ├── login.html ├── students.html ├── attendance.html ├── results.html ├── reports.html ├── css/ │   └── style.css └── js/ ├── api.js ├── auth.js ├── dashboard.js ├── students.js ├── attendance.js └── results.js


---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/<Vic-Jayi>/student-sms.git
cd student-sms/Backend

2. Install dependencies

npm install

3. Configure environment
Create a .env file in Backend/

JWT_SECRET=your_secret_key

4. Initialize database
node server.js --init

Backend runs at: http://localhost:3000
6. Open frontend
Open Frontend/index.html in your browser.
Login with:
- Email: admin@sms.local
- Password: admin123

🔗 Demo Credentials
- Email: admin@sms.local
- Password: admin123


📈 Future Improvements
- Deploy backend on Render/Heroku
- Host frontend on GitHub Pages/Netlify
- Add role‑based access (teachers, students)
- Improve UI with React or Vue

👩‍💻 Author
Developed by Jayita
Persistent and resourceful full‑stack developer, focused on building robust, portfolio‑ready web applications.



