const fs = require('fs');
const path = require('path');
const qr = require('qrcode');

const generateQRCode = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required!' });
        }

        // Generate QR code as a Data URL
        const qrCodeDataUrl = await qr.toDataURL(text);

        // Extract base64 data from the Data URL
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");

        // Generate a unique filename based on the current timestamp
        const fileName = `qr-${Date.now()}.png`;

        // Define the absolute path where you want to save the QR code image
        const filePath = path.join(__dirname, '..', 'qrcodes', fileName);

        // Write the base64 data to the file asynchronously
        fs.writeFile(filePath, base64Data, 'base64', (err) => {
            if (err) {
                console.error('Error saving QR code:', err);
                return next(err);
            }
            // Send the path of the saved QR code image in the response
            res.status(200).json({ imagePath: filePath });
        });

    } catch (error) {
        console.error('Error generating QR code:', error);
        return next(error);
    }
};

module.exports = { generateQRCode };
