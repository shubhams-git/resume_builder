import { useState, useCallback } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleGeneratePdf = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const latexContent = `
      \\documentclass{article}
      \\begin{document}
      Hello, World! Wish Baweja Happy Birthday!
      \\end{document}
    `;

    try {
      const response = await axios.post(
        'http://localhost:3000/generate-pdf',
        { content: latexContent },
        { responseType: 'blob' }
      );
      saveAs(response.data, 'birthday_wish.pdf');
    } catch (error) {
      setErrorMessage('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="app-container">
      <button
        onClick={handleGeneratePdf}
        disabled={isLoading}
        className="generate-button"
      >
        {isLoading ? 'Generating...' : 'Generate  PDF'}
      </button>
      {errorMessage && (
        <p className="error-message" style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default App;