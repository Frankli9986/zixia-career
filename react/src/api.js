// API utility functions for communicating with backend

export async function parseResume(file) {
  // Read file content based on extension
  const ext = file.name.split('.').pop().toLowerCase();
  let resumeText = '';

  if (ext === 'txt') {
    resumeText = await file.text();
  } else if (ext === 'pdf') {
    resumeText = await extractPdfText(file);
  } else if (ext === 'doc' || ext === 'docx') {
    resumeText = await extractDocxText(file);
  }

  if (!resumeText || resumeText.trim().length < 20) {
    throw new Error('文件内容读取失败');
  }

  // Send to our server (which proxies to DeepSeek)
  const response = await fetch('/api/parse-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || '解析失败');
  }

  return response.json();
}

async function extractPdfText(file) {
  if (!window.pdfjsLib) {
    throw new Error('PDF库未加载');
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }

  return text;
}

async function extractDocxText(file) {
  if (!window.mammoth) {
    throw new Error('Word库未加载');
  }

  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
