const fs = require('fs');
const path = require('path');
const qr = require('qrcode');

const generateQRCode = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required!' });
        }

        // Generate QR code data URL from the text
        const qrCodeDataUrl = await qr.toDataURL(text);

        // Extract base64 data from the data URL
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");

        // Define the directory and file path for saving the QR code image
        const qrCodePath = process.env.QR_CODE_PATH || 'generated_files/qrcodes';
        const fileName = `qr-${Date.now()}.png`;
        const filePath = path.join(qrCodePath, fileName);

        // Create the directory path recursively if it doesn't exist
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating directory:', err);
                return next(err); // Pass the error to the next middleware function
            }

            // Write the base64 data to the file path
            fs.writeFile(filePath, base64Data, 'base64', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing QR code image:', writeErr);
                    return next(writeErr); // Pass the error to the next middleware function
                }

                // Send a success response with the image path
                res.status(200).json({ imagePath: filePath });
            });
        });

    } catch (error) {
        console.error('Error generating QR code:', error);
        return next(error);
    }
};

module.exports = { generateQRCode };
