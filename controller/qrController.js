const fs = require('fs').promises;
const path = require('path');
const qr = require('qrcode');
const os = require('os');

const generateQRCode = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required!' });
        }

        // Generate the QR code as a Data URL (Base64 string)
        const qrCodeDataUrl = await qr.toDataURL(text);

        // Remove the "data:image/png;base64," prefix to extract the Base64-encoded data
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");

        const fileName = `qr-${Date.now()}.png`;

        const userHome = os.homedir();
        const downloadsPath = path.join(userHome, 'Downloads');
        const filePath = path.join(downloadsPath, fileName);

        await fs.mkdir(path.dirname(filePath), { recursive: true });

        await fs.writeFile(filePath, base64Data, 'base64');

        res.status(200).json({ imagePath: filePath });
    } catch (error) {
        return next(error);
    }
};

module.exports = { generateQRCode };