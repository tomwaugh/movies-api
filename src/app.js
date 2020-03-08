const express = require('express');
const app = express();
const port = 3000;

app.get('*', (req, res) => res.send('Invalid route. Please check the documentation for help on using this api.'));

app.listen(port, () => console.log(`Listening on port ${port}`));
