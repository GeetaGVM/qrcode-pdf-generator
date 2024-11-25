const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const generatePDF = async (req, res, next) => {
    try {
        const { text } = req.body;

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        
        // Set font and draw text
        const fontSize = 20;
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        page.drawText(text, {
            x: 50,
            y: 500,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
        });

        // Save PDF to bytes
        const pdfBytes = await pdfDoc.save();
      
        const userHome = os.homedir(); // Ensure the 'os' module is used for the home directory
        const downloadsPath = path.join(userHome, 'Downloads');
        const filePath = path.join(downloadsPath, 'generated-file.pdf');

        // Ensure the directory exists before writing the file
        await fs.mkdir(path.dirname(filePath), { recursive: true });

        // Write the PDF to the file system
        await fs.writeFile(filePath, pdfBytes);

        // Send a response with the file path
        res.status(200).json({ message: 'PDF generated successfully.', filePath });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return next(error);
    }
};

module.exports = { generatePDF };