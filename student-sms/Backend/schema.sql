-- Users (admins/teachers)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin','teacher')) NOT NULL DEFAULT 'teacher',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  roll_no TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT,
  dob DATE,
  guardian TEXT,
  phone TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK(status IN ('Present','Absent','Late')) NOT NULL,
  FOREIGN KEY(student_id) REFERENCES students(id),
  UNIQUE(student_id, date)
);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  class TEXT NOT NULL
);

-- Results
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  term TEXT NOT NULL,
  marks_obtained REAL NOT NULL,
  max_marks REAL NOT NULL,
  grade TEXT,
  FOREIGN KEY(student_id) REFERENCES students(id),
  FOREIGN KEY(subject_id) REFERENCES subjects(id),
  UNIQUE(student_id, subject_id, term)
);