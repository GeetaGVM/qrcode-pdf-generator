const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs')
const path = require('path');
// const fs = require('fs')
const fsPromises = require('fs').promises;

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
  
      // const pdfBytes = await pdfDoc.save();
     
      const rootDir = path.resolve(__dirname);
      const pdfDir = path.join(rootDir, 'generated_files', 'pdf');
      const filePath = path.join(pdfDir, 'generated-pdf.pdf');

      if (!fs.existsSync(pdfDir)) {
          await fsPromises.mkdir(pdfDir, { recursive: true });
      }

      const pdfBytes = await pdfDoc.save();

      await fs.writeFile(filePath, pdfBytes);

      res.status(200).json({ message: 'PDF generated successfully.', pdfPath: filePath });
  
    } catch (error) {
      console.error('Error generating PDF:', error);
      return next(error);
    }
  };

module.exports = {generatePDF};