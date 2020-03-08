const express = require('express');
const app = express();
const port = 3000;
const { pool } = require('../db/db_config');

app.get('/api/v1/suggestions', (req, res) => {
  const { q, sortBy } = req.query;

  if (sortBy && !['rotten', 'audience'].includes(sortBy)) {
    res.status(400).json({ error: 'Invalid sortBy value. Valid values are \'audience\' and \'rotten\'.' }).end();
    return;
  }

  let query = 'SELECT * FROM movies';
  let values = [];

  if (q) {
    query += ' WHERE film ILIKE $1'; // ILIKE handles case
    values.push(`%${q}%`);
  }

  // node-postgres doesn't handle parameterising that well but we only need to handle 2 cases so can use ifs
  if (sortBy === 'audience') {
    query += ' ORDER BY audience_score DESC';
  } else if (sortBy === 'rotten') {
    query += ' ORDER BY rotten_score DESC';
  }

  pool.query(
    query,
    values,
    (error, results) => {
      if (error) {
        console.error(error);
      }
      res.status(200).json(results.rows)
    }
  );
});

app.get('*', (req, res) => res.send('Invalid route. Please check the documentation for help on using this api.'));

app.listen(port, () => console.log(`Listening on port ${port}`));
