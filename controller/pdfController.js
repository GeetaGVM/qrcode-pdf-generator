const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

const generatePDF = async (req, res, next) => {
    try {
        const { text } = req.body;

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Add a page to the PDF document
        const page = pdfDoc.addPage();

        // Set font size and embed the Helvetica font
        const fontSize = 20;
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Add text to the page
        page.drawText(text, {
            x: 50,
            y: 500,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
        });

        // Save the PDF document to a byte array
        const pdfBytes = await pdfDoc.save();


        const rootDir = path.resolve(__dirname);
        
        const pdfDir = path.join(rootDir, 'generated_files', 'pdf');
        
        // Ensure that the directory exists (create it if it doesn't)
        await fs.mkdir(pdfDir, { recursive: true });

        // Define the path and filename for the PDF file
        const filePath = path.join(pdfDir, 'generated-pdf.pdf');
        
        // Write the PDF byte array to the specified file path
        await fs.writeFile(filePath, pdfBytes);

        // Send a response indicating success and the path to the generated PDF file
        res.status(200).json({ message: 'PDF generated successfully.', pdfPath: filePath });

    } catch (error) {
        // Handle any errors that occur during the PDF generation process
        console.error('Error generating PDF:', error);
        return next(error);
    }
};

module.exports = { generatePDF };
