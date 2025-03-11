import latex from 'node-latex';
import { readFileSync } from 'fs';
import path from 'path';
import { sanitizeLatex } from '../utils/sanitize.js';
import config from '../config/index.js';

const templatesDir = path.join(process.cwd(), 'src/templates');

export const generatePDF = async (resumeData) => {
  try {
    // Validate required template name
    if (!resumeData.template) {
      throw new Error('Template name is required');
    }

    const templatePath = path.join(templatesDir, `${resumeData.template}.tex`);
    let template = readFileSync(templatePath, 'utf-8');

    // Build sections data
    const sections = {
      // Personal info
      name: resumeData.title || '',
      summary: resumeData.summary || '',

      // Skills section
      skills: resumeData.skills?.map(skill => ({
        category: sanitizeLatex(skill.category),
        items: skill.skills.map(s => sanitizeLatex(s)).join(', ')
      })) || [],

      // Experience section
      experience: resumeData.experience?.map(exp => ({
        company: sanitizeLatex(exp.company),
        position: sanitizeLatex(exp.position),
        location: sanitizeLatex(exp.location || ''),
        description: sanitizeLatex(exp.description || ''),
        startDate: exp.startDate ? new Date(exp.startDate).toLocaleDateString() : '',
        endDate: exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'
      })) || [],

      // Education section  
      education: resumeData.education?.map(edu => ({
        institution: sanitizeLatex(edu.institution),
        degree: sanitizeLatex(edu.degree),
        field: sanitizeLatex(edu.field),
        startDate: edu.startDate ? new Date(edu.startDate).toLocaleDateString() : '',
        endDate: edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'
      })) || [],

      // Projects section
      projects: resumeData.projects?.map(proj => ({
        title: sanitizeLatex(proj.title),
        description: sanitizeLatex(proj.description),
        githubLink: sanitizeLatex(proj.githubLink || ''),
        website: sanitizeLatex(proj.website || '')
      })) || [],

      // Certifications
      certifications: resumeData.certifications?.map(cert => ({
        name: sanitizeLatex(cert.name),
        organization: sanitizeLatex(cert.organization),
        date: cert.date ? new Date(cert.date).toLocaleDateString() : ''
      })) || [],

      // Involvement/Activities
      involvement: resumeData.involvement?.map(inv => ({
        organization: sanitizeLatex(inv.organization),
        role: sanitizeLatex(inv.role),
        description: sanitizeLatex(inv.description),
        date: inv.date ? new Date(inv.date).toLocaleDateString() : ''
      })) || []
    };

    // Replace all placeholders in template
    Object.entries(sections).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key.toUpperCase()}}}`, 'g');
      if (Array.isArray(value)) {
        // Handle array sections with LaTeX formatting
        template = template.replace(placeholder, value.map(item => {
          return Object.entries(item)
            .map(([k, v]) => `\\${k}{${v}}`)
            .join('\n');
        }).join('\n\n'));
      } else {
        // Handle simple string replacements
        template = template.replace(placeholder, sanitizeLatex(value));
      }
    });

    // Generate PDF with proper settings
    const pdfStream = latex(template, {
      cmd: config.pdflatexPath,
      passes: 2,
      errorLogs: true,
      precompiled: false
    });

    return pdfStream;
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};