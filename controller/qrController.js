const fs = require('fs');
const path = require('path');
const qr = require('qrcode');
const { PDFDocument, rgb } = require('pdf-lib');

const generateQRCode = async (req, res ,next) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required!' });
        }

        const qrCodeDataUrl = await qr.toDataURL(text);
        
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");

        const fileName = `qr-${Date.now()}.png`;

        const qrCodePath = process.env.QR_CODE_PATH || 'generated_files/qrcodes';
        
        const filePath = path.join(qrCodePath, fileName);


        await fsPromises.mkdir(path.dirname(filePath), { recursive: true });

        res.status(200).json({ imagePath: filePath });
    } catch (error) {
      return next(error);
    }
};
 

module.exports = {generateQRCode};