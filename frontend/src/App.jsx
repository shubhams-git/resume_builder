import { useState, useCallback, Suspense, lazy } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './App.css';
import LoginPage from './app/login/page';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function lazyWithDelay(factory, delay = 2500) {
  return lazy(() =>
    Promise.all([
      factory(),
      new Promise(resolve => setTimeout(resolve, delay))
    ]).then(([moduleExports]) => moduleExports)
  );
}

const Login = lazyWithDelay(() => import('./app/login/page'), 2500);


const splash = (
  <DotLottieReact
    src="https://lottie.host/306a447b-87d4-4729-a9d9-91f642bc399c/B4V1Qj3kKO.lottie"
    loop
    autoplay
  />
)
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
    <BrowserRouter>
      <Suspense fallback= {splash}>
      <div className="fade-in">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Suspense>
    
    
    </BrowserRouter>
    // <div className="app-container">
    //   <Button
    //     onClick={handleGeneratePdf}
    //     disabled={isLoading}
    //     className="generate-button"
    //   >
    //     {isLoading ? 'Generating...' : 'Generate  PDF'}
    //   </Button>
    //   {errorMessage && (
    //     <p className="error-message" style={{ color: 'red' }}>
    //       {errorMessage}
    //     </p>
    //   )}
    // </div>
  );
};

export default App;