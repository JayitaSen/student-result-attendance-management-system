const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'sms.db');

const db = new sqlite3.Database(dbPath);

function runSql(file) {
  const fs = require('fs');
  const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
}

module.exports = { db, runSql };