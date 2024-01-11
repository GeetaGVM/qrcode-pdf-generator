const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

const generatePDF = async (req, res, next) => {
  try {
    const { text } = req.body;

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage();

    const fontSize = 20;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.drawText(text, {
      x: 50,
      y: 500,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    const directoryPath = '/var/task/pdffiles/';
    const fileName = `generated-pdf-${Date.now()}.pdf`;
    const filePath = path.join(directoryPath, fileName);

    // Check if directory exists, if not, create it
    if (!(await fs.stat(directoryPath).catch(() => false))) {
      await fs.mkdir(directoryPath, { recursive: true });
      // Set directory permissions (e.g., 755 for rwxr-xr-x)
      await fs.chmod(directoryPath, 0o755); // 0o755 is octal notation for permissions
    }

    // Write the PDF file to the directory
    await fs.writeFile(filePath, pdfBytes);

    // Set file permissions (e.g., 644 for rw-r--r--)
    await fs.chmod(filePath, 0o644); // 0o644 is octal notation for permissions

    res.status(200).json({ message: 'PDF generated successfully.', filePath });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return next(error);
  }
};

module.exports = { generatePDF };
