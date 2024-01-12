const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
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
      const filePath = path.join(pdfPath, 'generated-pdf.pdf');
      
      // Create directory recursively and handle errors with a callback
      fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating directory:', err);
          return next(err); // Pass the error to the next middleware function
        }

        // Save the PDF file to the specified path
        fs.writeFile(filePath, pdfBytes, (writeErr) => {
          if (writeErr) {
            console.error('Error writing PDF file:', writeErr);
            return next(writeErr); // Pass the error to the next middleware function
          }

          // Send a success response if everything goes well
          res.status(200).json({ message: 'PDF generated successfully.', filePath });
        });
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      return next(error);
    }
};

module.exports = { generatePDF };
