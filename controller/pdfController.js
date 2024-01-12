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
     
      const pdfPath = process.env.PDF_PATH || 'generated_files/pdf';
      const filePath = path.join(__dirname, '..', pdfPath, 'generated-pdf.pdf');

      // const filePath = path.join(__dirname, '..', 'pdffiles', 'generated-pdf.pdf');
      await fs.writeFile(filePath, pdfBytes);
  
      res.status(200).json({ message: 'PDF generated successfully.', filePath });
    } catch (error) {
      console.error('Error generating PDF:', error);
      return next(error);
    }
  };

module.exports = {generatePDF};