import { useState, useEffect } from 'react';
import styles from './TodoForm.module.css';

export default function TodoForm({ onSubmit, editingTodo, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setCategory(editingTodo.category || '');
      setPriority(editingTodo.priority || 'medium');
    } else {
      setTitle('');
      setCategory('');
      setPriority('medium');
    }
  }, [editingTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, category, priority });
    if (!editingTodo) {
      setTitle('');
      setCategory('');
      setPriority('medium');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className={styles.row}>
        <input
          className={styles.categoryInput}
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <select
          className={styles.select}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className={styles.btn} type="submit">
          {editingTodo ? 'Update' : 'Add'}
        </button>
        {editingTodo && (
          <button className={styles.cancelBtn} type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
