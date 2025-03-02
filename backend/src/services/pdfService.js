import latex from 'node-latex';
import { readFileSync } from 'fs';
import path from 'path';
import { sanitizeLatex } from '../utils/sanitize.js';
import config from '../config/index.js';

const templatesDir = path.join(process.cwd(), 'src/templates');

export const generatePDF = (resumeData) => {
  try {
    const templatePath = path.join(templatesDir, `${resumeData.template}.tex`);
    let template = readFileSync(templatePath, 'utf-8');

    // Replace placeholders with sanitized data
    template = template
      .replace(/{{NAME}}/g, sanitizeLatex(resumeData.name || ''))
      .replace(/{{SUMMARY}}/g, sanitizeLatex(resumeData.summary || ''));

    const pdfStream = latex(template, {
      cmd: config.pdflatexPath,
      passes: 2,
    });

    return pdfStream;
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};