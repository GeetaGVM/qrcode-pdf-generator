const express = require('express');
const bodyParser = require('body-parser');
const qrRoutes = require('./routes/qrRoutes');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 
const serverless = require('serverless-http');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());


const { dashLogger } = require("./utils/logger");
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));
app.use('/pdffiles', express.static(path.join(__dirname, 'pdffiles')));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', qrRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  dashLogger.error(`${err}, \nRequest: ${req.originalUrl}, \nRequest Params: ${JSON.stringify(req.query)}, \nRequest Body: ${JSON.stringify(req.body)}`);
  res.status(500).json({ message: 'Something went wrong' });
});


// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
