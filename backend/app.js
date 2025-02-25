const express = require('express');
const latex = require('node-latex');
const fs = require('fs');
const cors = require('cors')

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',  // Replace with your React app's URL
    methods: ['GET', 'POST'],        // Allow necessary HTTP methods
  }));
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to generate PDF from LaTeX content
app.post('/generate-pdf', (req, res) => {
    // Expect LaTeX content in the request body
    const latexContent = req.body.content;
    
    if (!latexContent) {
        return res.status(400).send('No LaTeX content provided');
    }

    // Define the output stream for the PDF
    const output = fs.createWriteStream('output.pdf');
    
    // Specify the full path to pdflatex.exe (replace with your actual path)
    const pdf = latex(latexContent, { cmd: process.env.PDFLATEX_PATH });
    // Pipe the PDF generation to the output file
    pdf.pipe(output);

    pdf.on('error', (err) => {
        console.error('Error generating PDF:', err);
        res.status(500).send('Failed to generate PDF');
    });

    pdf.on('finish', () => {
        console.log('PDF generated successfully');
        // Send the generated PDF file as a response
        res.download('output.pdf', 'document.pdf', (err) => {
            if (err) {
                console.error('Error sending PDF:', err);
                res.status(500).send('Error sending PDF');
            }
            // Optionally, delete the file after sending (uncomment if desired)
            // fs.unlinkSync('output.pdf');
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});