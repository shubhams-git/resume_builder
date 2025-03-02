export const sanitizeLatex = (input = '') => {
    const replacements = {
      '&': '\\&',
      '%': '\\%',
      '$': '\\$',
      '#': '\\#',
      '_': '\\_',
      '{': '\\{',
      '}': '\\}',
      '~': '\\textasciitilde{}',
      '^': '\\textasciicircum{}',
      '\\': '\\textbackslash{}',
    };
  
    return String(input)
      .replace(/[&%$#_{}~^\\]/g, (char) => replacements[char])
      .replace(/(\\[a-zA-Z]+)/g, '') // Remove LaTeX commands
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };