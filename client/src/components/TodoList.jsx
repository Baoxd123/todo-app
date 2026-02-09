import { useRef } from 'react';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

export default function TodoList({ todos, onToggle, onDelete, onEdit, onReorder }) {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const reordered = [...todos];
    const [removed] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, removed);

    dragItem.current = null;
    dragOverItem.current = null;

    onReorder(reordered.map((t) => t.id));
  };

  if (todos.length === 0) {
    return <p className={styles.empty}>No todos yet. Add one above!</p>;
  }

  return (
    <div className={styles.list}>
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          dragHandlers={{
            onDragStart: () => handleDragStart(index),
            onDragEnter: () => handleDragEnter(index),
            onDragEnd: handleDragEnd,
            onDragOver: (e) => e.preventDefault(),
          }}
        />
      ))}
    </div>
  );
}
