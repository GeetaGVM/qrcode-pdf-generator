const fs = require('fs');
const path = require('path');
const qr = require('qrcode');
const { PDFDocument, rgb } = require('pdf-lib');

const generateQRCode = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required!' });
    }

    const qrCodeDataUrl = await qr.toDataURL(text);

    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");

    const fileName = `qr-${Date.now()}.png`;

    const directoryPath = '/var/task/pdffiles/';
    const filePath = path.join(directoryPath, fileName);

    // Check if directory exists, if not, create it
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
      // Set directory permissions (e.g., 755 for rwxr-xr-x)
      fs.chmodSync(directoryPath, 0o755); // 0o755 is octal notation for permissions
    }

    // Write the file with base64 data
    fs.writeFileSync(filePath, base64Data, 'base64');

    // Set file permissions (e.g., 644 for rw-r--r--)
    fs.chmodSync(filePath, 0o644); // 0o644 is octal notation for permissions

    res.status(200).json({ imagePath: filePath });
  } catch (error) {
    return next(error);
  }
};

module.exports = { generateQRCode };
