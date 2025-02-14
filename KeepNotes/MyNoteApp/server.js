import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({
  user: process.env.USERPG,
  host: 'localhost',
  database: 'Project',
  password: process.env.PASSWORDPG,
  port: 5432
});

app.get('/api/notes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM notes');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/api/notes', async (req, res) => {
  const { text, x, y } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO notes (text, x, y) VALUES ($1, $2, $3) RETURNING *',
      [text, x, y]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM notes WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const result = await db.query(
      'UPDATE notes SET text = $1 WHERE id = $2 RETURNING *',
      [text, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
