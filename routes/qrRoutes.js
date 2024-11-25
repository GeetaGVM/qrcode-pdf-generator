const express = require('express');
const router = express.Router();
const qrController = require('../controller/qrController');
const pdfController = require('../controller/pdfController');
const DecodeQRCode = require('../controller/QRtoTextController');



router.post('/generate-qrcode', qrController.generateQRCode);
router.post('/generate-pdf', pdfController.generatePDF);
router.post('/decode-qrcode', DecodeQRCode.decodeQRCode);



module.exports = router;
