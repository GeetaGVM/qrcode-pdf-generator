const express = require('express');
const bodyParser = require('body-parser');
const qrRoutes = require('./routes/qrRoutes');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 
// const { dashLogger } = require("./utils/logger");

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Serve static files
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));
app.use('/pdffiles', express.static(path.join(__dirname, 'pdffiles')));

// Swagger UI setup
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Custom route for the root endpoint
app.get('/', (req, res) => {
  res.send('Hello from Node.js');
});

// Use your existing routes
app.use('/', qrRoutes);

// 404 Error handling
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   dashLogger.error(`${err}, \nRequest: ${req.originalUrl}, \nRequest Params: ${JSON.stringify(req.query)}, \nRequest Body: ${JSON.stringify(req.body)}`);
//   res.status(500).json({ message: 'Something went wrong' });
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// app.use('/.netlify/functions/api', router);
// module.exports.handler = serverless(app);
