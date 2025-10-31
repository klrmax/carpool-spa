const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the dist/carpool-spa/browser directory
app.use(express.static(path.join(__dirname, 'dist/carpool-spa/browser')));

// Send all requests to index.html (for Angular routing)
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/carpool-spa/browser/index.html'));
});

// Start the server on the port provided by Heroku or default to 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
