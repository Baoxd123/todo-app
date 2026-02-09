const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/todos - list with optional filters
router.get('/', (req, res) => {
  const { category, priority, search } = req.query;

  let sql = 'SELECT * FROM todos WHERE 1=1';
  const params = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (priority) {
    sql += ' AND priority = ?';
    params.push(priority);
  }
  if (search) {
    sql += ' AND title LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY sort_order ASC, created_at DESC';

  const todos = db.prepare(sql).all(...params);
  res.json(todos);
});

// POST /api/todos - create
router.post('/', (req, res) => {
  const { title, category = '', priority = 'medium' } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) AS max FROM todos').get();
  const sort_order = maxOrder.max + 1;

  const result = db.prepare(
    'INSERT INTO todos (title, category, priority, sort_order) VALUES (?, ?, ?, ?)'
  ).run(title.trim(), category, priority, sort_order);

  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(todo);
});

// PUT /api/todos/reorder - batch update sort order
router.put('/reorder', (req, res) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array is required' });
  }

  const update = db.prepare('UPDATE todos SET sort_order = ? WHERE id = ?');
  const batchUpdate = db.transaction((ids) => {
    ids.forEach((id, index) => {
      update.run(index, id);
    });
  });

  batchUpdate(orderedIds);
  res.json({ success: true });
});

// PUT /api/todos/:id - update
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed, category, priority } = req.body;

  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const updated = {
    title: title !== undefined ? title.trim() : existing.title,
    completed: completed !== undefined ? (completed ? 1 : 0) : existing.completed,
    category: category !== undefined ? category : existing.category,
    priority: priority !== undefined ? priority : existing.priority,
  };

  db.prepare(
    'UPDATE todos SET title = ?, completed = ?, category = ?, priority = ? WHERE id = ?'
  ).run(updated.title, updated.completed, updated.category, updated.priority, id);

  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  res.json(todo);
});

// DELETE /api/todos/:id - delete
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.json({ success: true });
});

module.exports = router;
