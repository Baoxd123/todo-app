import styles from './FilterBar.module.css';

export default function FilterBar({ filters, onChange, categories }) {
  const update = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className={styles.bar}>
      <input
        className={styles.search}
        type="text"
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => update('search', e.target.value)}
      />
      <select
        className={styles.select}
        value={filters.category}
        onChange={(e) => update('category', e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        value={filters.priority}
        onChange={(e) => update('priority', e.target.value)}
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
}
