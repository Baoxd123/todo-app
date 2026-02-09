const BASE = '/api/todos';

export async function fetchTodos(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.search) params.set('search', filters.search);

  const query = params.toString();
  const res = await fetch(`${BASE}${query ? `?${query}` : ''}`);
  return res.json();
}

export async function createTodo(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTodo(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function reorderTodos(orderedIds) {
  const res = await fetch(`${BASE}/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedIds }),
  });
  return res.json();
}
