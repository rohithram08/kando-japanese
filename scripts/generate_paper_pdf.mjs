import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const mdPath = path.resolve('docs/RESEARCH_PAPER.md');
const htmlPath = path.resolve('docs/kando_paper_render.html');
const pdfPath = path.resolve('docs/kando_japanese_research_paper.pdf');

const markdown = fs.readFileSync(mdPath, 'utf8');

// Basic markdown to HTML converter tailored for academic formatting
function markdownToHtml(md) {
  let html = md;

  // Escape HTML entities in code blocks first
  const codeBlocks = [];
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `%%%CODEBLOCK_${codeBlocks.length}%%%`;
    codeBlocks.push({ lang, code });
    return placeholder;
  });

  // Math display blocks
  const mathBlocks = [];
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    const placeholder = `%%%MATHBLOCK_${mathBlocks.length}%%%`;
    mathBlocks.push(math.trim());
    return placeholder;
  });

  // Inline math
  const inlineMath = [];
  html = html.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
    const placeholder = `%%%INLINEMATH_${inlineMath.length}%%%`;
    inlineMath.push(math.trim());
    return placeholder;
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr />');

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Tables
  html = html.replace(/^(\|.+\|\r?\n)+/gm, (tableMatch) => {
    const lines = tableMatch.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) return tableMatch;
    
    let tableHtml = '<div class="table-container"><table>\n<thead>\n<tr>';
    const headerCells = lines[0].split('|').slice(1, -1);
    headerCells.forEach(cell => {
      tableHtml += `<th>${cell.trim()}</th>`;
    });
    tableHtml += '</tr>\n</thead>\n<tbody>\n';

    // Skip separator line (index 1)
    for (let i = 2; i < lines.length; i++) {
      tableHtml += '<tr>';
      const cells = lines[i].split('|').slice(1, -1);
      cells.forEach(cell => {
        tableHtml += `<td>${cell.trim()}</td>`;
      });
      tableHtml += '</tr>\n';
    }
    tableHtml += '</tbody>\n</table></div>\n';
    return tableHtml;
  });

  // Paragraphs
  const lines = html.split('\n\n');
  html = lines.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<table') || trimmed.startsWith('<div') || trimmed.startsWith('<hr') || trimmed.startsWith('%%%CODEBLOCK') || trimmed.startsWith('%%%MATHBLOCK')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
  }).join('\n\n');

  // Restore code blocks
  codeBlocks.forEach((b, i) => {
    const safeCode = b.code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    if (b.lang === 'mermaid') {
      html = html.replace(`%%%CODEBLOCK_${i}%%%`, `<div class="mermaid">\n${b.code}\n</div>`);
    } else {
      html = html.replace(`%%%CODEBLOCK_${i}%%%`, `<pre><code class="language-${b.lang}">${safeCode}</code></pre>`);
    }
  });

  // Restore math blocks
  mathBlocks.forEach((m, i) => {
    html = html.replace(`%%%MATHBLOCK_${i}%%%`, `<div class="math-display">\\[${m}\\]</div>`);
  });

  // Restore inline math
  inlineMath.forEach((m, i) => {
    html = html.replace(`%%%INLINEMATH_${i}%%%`, `\\(${m}\\)`);
  });

  return html;
}

const articleBody = markdownToHtml(markdown);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Kando (感動) — Research Paper</title>
  
  <!-- KaTeX for crisp LaTeX formula rendering -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

  <!-- Mermaid for architectural diagrams -->
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>

  <!-- Google Fonts for Academic / Computer Modern Aesthetic -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;600;700&family=Noto+Sans+JP:wght@400;600;700&display=swap" rel="stylesheet">

  <style>
    @page {
      size: A4;
      margin: 22mm 18mm 22mm 18mm;
      @bottom-right {
        content: counter(page);
        font-family: 'Crimson Pro', Georgia, serif;
        font-size: 10pt;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Crimson Pro', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.55;
      color: #1a1a1a;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }

    .paper-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 21pt;
      font-weight: 800;
      line-height: 1.25;
      color: #0f172a;
      text-align: center;
      margin-top: 10px;
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }

    .author-block {
      text-align: center;
      font-family: 'Inter', sans-serif;
      font-size: 10.5pt;
      color: #334155;
      margin-bottom: 24px;
      line-height: 1.4;
    }

    .author-name {
      font-weight: 700;
      font-size: 12pt;
      color: #0f172a;
    }

    h2 {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 13.5pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 24px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    h3 {
      font-family: 'Inter', sans-serif;
      font-size: 11pt;
      font-weight: 600;
      color: #1e293b;
      margin-top: 18px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    p {
      text-align: justify;
      text-justify: inter-word;
      margin-top: 0;
      margin-bottom: 10px;
    }

    hr {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }

    .math-display {
      text-align: center;
      margin: 14px 0;
      overflow-x: auto;
      font-size: 11pt;
    }

    pre {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      line-height: 1.4;
      overflow-x: auto;
      margin: 14px 0;
      page-break-inside: avoid;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5pt;
      background-color: #f1f5f9;
      padding: 2px 4px;
      border-radius: 4px;
    }

    pre code {
      background: none;
      padding: 0;
    }

    .table-container {
      width: 100%;
      margin: 16px 0;
      overflow-x: auto;
      page-break-inside: avoid;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
      font-family: 'Inter', sans-serif;
    }

    th {
      background-color: #f1f5f9;
      border-top: 1.5px solid #0f172a;
      border-bottom: 1.5px solid #0f172a;
      padding: 8px 10px;
      text-align: left;
      font-weight: 600;
      color: #0f172a;
    }

    td {
      padding: 7px 10px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }

    tr:last-child td {
      border-bottom: 1.5px solid #0f172a;
    }

    .mermaid {
      display: flex;
      justify-content: center;
      margin: 18px 0;
      page-break-inside: avoid;
    }

    /* Print adjustments */
    @media print {
      body {
        font-size: 10.5pt;
      }
      .paper-container {
        max-width: 100%;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="paper-container">
    ${articleBody}
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", function() {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '\\\\[', right: '\\\\]', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\\\(', right: '\\\\)', display: false}
          ],
          throwOnError: false
        });
      }
      if (window.mermaid) {
        mermaid.initialize({ startOnLoad: true, theme: 'neutral' });
      }
    });
  </script>
</body>
</html>`;

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log('Generated paper HTML at:', htmlPath);

// Invoke Chrome / Edge headless to print to PDF
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserExe = fs.existsSync(chromePath) ? chromePath : edgePath;

console.log('Using browser binary for rendering:', browserExe);

const cmd = '"' + browserExe + '" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="' + pdfPath + '" "' + htmlPath + '"';

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('SUCCESS: Academic research paper compiled to PDF:');
  console.log(pdfPath);
  const stats = fs.statSync(pdfPath);
  console.log('File Size: ' + (stats.size / 1024).toFixed(1) + ' KB');
} catch (err) {
  console.error('PDF compilation failed:', err);
  process.exit(1);
}
