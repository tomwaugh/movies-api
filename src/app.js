const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { pool } = require('../db/db_config');

app.get('/api/v1/suggestions', (req, res) => {
  const { q, sortBy } = req.query;

  if (!q) {
    res.status(400).json({ error: 'Request must include a search term' });
    return;
  }

  if (sortBy && !['rotten', 'audience'].includes(sortBy)) {
    res.status(400).json({ error: 'Invalid sortBy value. Valid values are \'audience\' and \'rotten\'.' });
    return;
  }

  let query = 'SELECT * FROM movies WHERE film ILIKE $1'; // ILIKE handles case
  const values = [`%${q}%`];

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
      // Add back currency formatting and convert profitability from string
      const movies = results.rows.map(row => ({
        ...row,
        world_gross: `$${row.world_gross}`,
        profitability: parseFloat(row.profitability),
      }));
      res.status(200).json(movies);
    }
  );
});

app.get('*', (req, res) => res.status(404).json({ error: 'Invalid route. Please check the documentation for help on using this api.' }));

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
