import { useState, useEffect, useCallback } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo, reorderTodos } from './api/todos';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import styles from './App.module.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filters, setFilters] = useState({ category: '', priority: '', search: '' });
  const [editingTodo, setEditingTodo] = useState(null);

  const loadTodos = useCallback(async () => {
    const data = await fetchTodos(filters);
    setTodos(data);
  }, [filters]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleCreate = async (data) => {
    await createTodo(data);
    loadTodos();
  };

  const handleUpdate = async (id, data) => {
    await updateTodo(id, data);
    setEditingTodo(null);
    loadTodos();
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    loadTodos();
  };

  const handleToggle = async (todo) => {
    await updateTodo(todo.id, { completed: !todo.completed });
    loadTodos();
  };

  const handleReorder = async (orderedIds) => {
    await reorderTodos(orderedIds);
    loadTodos();
  };

  const categories = [...new Set(todos.map((t) => t.category).filter(Boolean))];

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Todo List</h1>
      <TodoForm
        onSubmit={editingTodo ? (data) => handleUpdate(editingTodo.id, data) : handleCreate}
        editingTodo={editingTodo}
        onCancel={() => setEditingTodo(null)}
      />
      <FilterBar filters={filters} onChange={setFilters} categories={categories} />
      <TodoList
        todos={todos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={setEditingTodo}
        onReorder={handleReorder}
      />
    </div>
  );
}
