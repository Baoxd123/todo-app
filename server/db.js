const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'todos.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    category TEXT DEFAULT '',
    priority TEXT DEFAULT 'medium',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

module.exports = db;
