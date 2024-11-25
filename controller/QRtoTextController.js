const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const qrcodeReader = require('qrcode-reader');

// Function to decode QR code from an image file
const decodeQRCode = async (req, res, next) => {
    try {
        const { filePath } = req.body;

        if (!filePath) {
            return res.status(400).json({ error: 'File path is required!' });
        }

        // Ensure the file exists
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
        if (!fileExists) {
            return res.status(400).json({ error: 'File does not exist' });
        }

        const { data, info } = await sharp(filePath)
            .raw()
            .toBuffer({ resolveWithObject: true });

        // Create a QR code reader instance
        const qr = new qrcodeReader();

        const imageData = {
            width: info.width,
            height: info.height,
            data: data,
        };

        // Decode the image
        qr.callback = function(error, value) {
            if (error) {
                return res.status(400).json({ error: 'Failed to decode the QR code', details: error });
            }
            res.status(200).json({ decodedText: value.result });
        };

        qr.decode(imageData);
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

module.exports = { decodeQRCode };