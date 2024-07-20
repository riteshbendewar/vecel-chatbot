// qastore-server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3002;

app.get('/qastore', (req, res) => {
  fs.readFile(path.join(__dirname, 'qastore.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading JSON file');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`QA Store server running at http://localhost:${port}`);
});
