const express = require('express');
const cors = require('cors');
const { db, runSql } = require('./db');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors());
app.use(express.json());

// Init DB from CLI flag
if (process.argv.includes('--init')) {
  (async () => {
    try {
      await runSql('schema.sql');
      console.log('Schema created.');
      // Create default admin with password 'admin123'
      const hash = await bcrypt.hash('admin123', 10);
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR IGNORE INTO users(name,email,password_hash,role) VALUES(?,?,?,?)`,
          ['Admin', 'admin@sms.local', hash, 'admin'],
          (err) => (err ? reject(err) : resolve())
        );
      });
      await runSql('seed.sql');
      console.log('Seeded.');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}

// Auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, name: user.name, role: user.role });
  });
});

// Students CRUD
app.get('/api/students', auth, (req, res) => {
  db.all('SELECT * FROM students ORDER BY class, section, roll_no', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

app.post('/api/students', auth, (req, res) => {
  const { roll_no, name, class: cls, section, dob, guardian, phone, email } = req.body;
  db.run(
    `INSERT INTO students(roll_no,name,class,section,dob,guardian,phone,email) VALUES(?,?,?,?,?,?,?,?)`,
    [roll_no, name, cls, section, dob, guardian, phone, email],
    function (err) {
      if (err) return res.status(400).json({ message: 'Insert failed', error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/students/:id', auth, (req, res) => {
  const { id } = req.params;
  const { roll_no, name, class: cls, section, dob, guardian, phone, email } = req.body;
  db.run(
    `UPDATE students SET roll_no=?, name=?, class=?, section=?, dob=?, guardian=?, phone=?, email=? WHERE id=?`,
    [roll_no, name, cls, section, dob, guardian, phone, email, id],
    function (err) {
      if (err) return res.status(400).json({ message: 'Update failed', error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

app.delete('/api/students/:id', auth, (req, res) => {
  db.run(`DELETE FROM students WHERE id=?`, [req.params.id], function (err) {
    if (err) return res.status(400).json({ message: 'Delete failed', error: err.message });
    res.json({ changes: this.changes });
  });
});

// Attendance
app.get('/api/attendance', auth, (req, res) => {
  const { date } = req.query; // optional filter
  const sql = date
    ? `SELECT a.*, s.name, s.roll_no FROM attendance a JOIN students s ON s.id=a.student_id WHERE date=? ORDER BY s.roll_no`
    : `SELECT a.*, s.name, s.roll_no FROM attendance a JOIN students s ON s.id=a.student_id ORDER BY date DESC`;
  db.all(sql, date ? [date] : [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

app.post('/api/attendance', auth, (req, res) => {
  const { student_id, date, status } = req.body;
  db.run(
    `INSERT OR REPLACE INTO attendance(student_id, date, status) VALUES(?,?,?)`,
    [student_id, date, status],
    function (err) {
      if (err) return res.status(400).json({ message: 'Save failed', error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Subjects
app.get('/api/subjects', auth, (req, res) => {
  db.all('SELECT * FROM subjects ORDER BY class, code', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

// Results
app.get('/api/results', auth, (req, res) => {
  const { student_id, term } = req.query;
  let sql = `SELECT r.*, s.name AS student_name, sub.name AS subject_name, sub.code
             FROM results r 
             JOIN students s ON s.id=r.student_id
             JOIN subjects sub ON sub.id=r.subject_id`;
  const args = [];
  const where = [];
  if (student_id) { where.push('r.student_id=?'); args.push(student_id); }
  if (term) { where.push('r.term=?'); args.push(term); }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY s.roll_no, sub.code';
  db.all(sql, args, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

app.post('/api/results', auth, (req, res) => {
  const { student_id, subject_id, term, marks_obtained, max_marks } = req.body;
  const pct = (marks_obtained / max_marks) * 100;
  const grade = pct >= 85 ? 'A' : pct >= 70 ? 'B' : pct >= 55 ? 'C' : pct >= 40 ? 'D' : 'F';
  db.run(
    `INSERT OR REPLACE INTO results(student_id, subject_id, term, marks_obtained, max_marks, grade) VALUES(?,?,?,?,?,?)`,
    [student_id, subject_id, term, marks_obtained, max_marks, grade],
    function (err) {
      if (err) return res.status(400).json({ message: 'Save failed', error: err.message });
      res.json({ id: this.lastID, grade });
    }
  );
});

// Dashboard KPIs
app.get('/api/kpis', auth, (req, res) => {
  const out = {};
  db.get('SELECT COUNT(*) AS total_students FROM students', [], (e, r1) => {
    if (e) return res.status(500).json({ message: 'DB error' });
    out.total_students = r1.total_students;
    db.get(`SELECT ROUND(AVG(CASE WHEN status='Present' THEN 1.0 ELSE 0.0 END) * 100, 1) AS avg_attendance FROM attendance`, [], (e2, r2) => {
      out.avg_attendance = r2?.avg_attendance || 0;
      db.get(`SELECT s.name FROM results r JOIN students s ON s.id=r.student_id GROUP BY r.student_id ORDER BY AVG(r.marks_obtained) DESC LIMIT 1`, [], (e3, r3) => {
        out.top_performer = r3?.name || '—';
        res.json(out);
      });
    });
  });
});

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));