INSERT INTO users (name, email, password_hash, role) VALUES
('Admin', 'admin@sms.local', '$2b$10$wqfhaXH0sampleHashedPasswordHere', 'admin'); -- replace with real hash via server init

INSERT INTO students (roll_no, name, class, section, dob, guardian, phone, email) VALUES
('2025-001', 'Aarav Kumar', '10', 'A', '2010-03-12', 'Rohit Kumar', '9876543210', 'aarav@example.com'),
('2025-002', 'Ananya Singh', '10', 'A', '2010-07-05', 'Meera Singh', '9876543211', 'ananya@example.com');

INSERT INTO subjects (name, code, class) VALUES
('Mathematics', 'MTH10', '10'),
('Science', 'SCI10', '10'),
('English', 'ENG10', '10');

INSERT INTO attendance (student_id, date, status) VALUES
(1, '2025-12-01', 'Present'),
(1, '2025-12-02', 'Absent'),
(2, '2025-12-01', 'Present');

INSERT INTO results (student_id, subject_id, term, marks_obtained, max_marks, grade) VALUES
(1, 1, 'Term-1', 88, 100, 'A'),
(1, 2, 'Term-1', 76, 100, 'B'),
(1, 3, 'Term-1', 91, 100, 'A'),
(2, 1, 'Term-1', 67, 100, 'C');