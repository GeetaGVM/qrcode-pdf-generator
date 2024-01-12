const express = require('express');
const bodyParser = require('body-parser');
const qrRoutes = require('./routes/qrRoutes');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 
// const { dashLogger } = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


// app.use('/qrcodes', express.static(path.join(__dirname, 'generated_files', 'qrcodes')));


// Swagger UI setup
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/', (req, res) => {
  res.send('Hello from Node.js');
});


app.use('/', qrRoutes);

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

