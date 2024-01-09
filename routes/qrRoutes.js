const express = require('express');
const router = express.Router();
const qrController = require('../controller/qrController');
const pdfController = require('../controller/pdfController');



router.post('/generate-qrcode', qrController.generateQRCode);
router.post('/generate-pdf', pdfController.generatePDF);



module.exports = router;
