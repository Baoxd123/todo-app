import styles from './TodoItem.module.css';

const priorityLabels = { high: 'High', medium: 'Med', low: 'Low' };

export default function TodoItem({ todo, onToggle, onDelete, onEdit, dragHandlers }) {
  return (
    <div
      className={`${styles.item} ${todo.completed ? styles.completed : ''}`}
      draggable
      {...dragHandlers}
    >
      <div className={styles.dragHandle}>&#x2630;</div>
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={!!todo.completed}
        onChange={() => onToggle(todo)}
      />
      <div className={styles.content}>
        <span className={styles.title}>{todo.title}</span>
        <div className={styles.meta}>
          {todo.category && <span className={styles.category}>{todo.category}</span>}
          <span className={`${styles.priority} ${styles[todo.priority]}`}>
            {priorityLabels[todo.priority] || todo.priority}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(todo)} title="Edit">
          &#9998;
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(todo.id)} title="Delete">
          &times;
        </button>
      </div>
    </div>
  );
}
