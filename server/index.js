const express = require('express');
const cors = require('cors');
const todosRouter = require('./routes/todos');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/todos', todosRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
