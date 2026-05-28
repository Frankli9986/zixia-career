// API utility functions for communicating with backend

export async function parseResume(file) {
  // Read file content based on extension
  const ext = file.name.split('.').pop().toLowerCase();
  let resumeText = '';

  if (ext === 'txt') {
    resumeText = await file.text();
  } else if (ext === 'pdf') {
    // Use PDF.js to extract text
    resumeText = await extractPdfText(file);
  } else if (ext === 'doc' || ext === 'docx') {
    // Use mammoth to extract text  
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
  // PDF.js would be loaded externally
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
  // mammoth would be loaded externally
  if (!window.mammoth) {
    throw new Error('Word库未加载');
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// Fallback: Direct DeepSeek API (if server not available)
export async function parseResumeDirect(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  let resumeText = '';
  
  if (ext === 'txt') {
    resumeText = await file.text();
  } else {
    throw new Error('直接模式仅支持TXT文件，请转换为TXT格式');
  }

  const API_KEY = 'sk-34dP43LGh3nyiKfKT4S1y7Jgb7e8vN2mRx4UwXp2Zq6Hc9LkFsTmYo8A9d';

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{
        role: 'user',
        content: `你是一个简历分析师。请从以下简历内容中提取求职者的职场偏好，输出JSON格式的8维参数（每项1-10的整数）：
JSON格式：
{"overwork":数字,"care":数字,"leadership":数字,"competition":数字,"process":数字,"growth":数字,"innovation":数字,"worklife":数字}
只输出JSON。
简历内容：${resumeText.substring(0, 3000)}`
      }]
    })
  });

  if (!response.ok) throw new Error('API请求失败');

  const data = await response.json();
  const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('无法解析返回值');

  return JSON.parse(jsonMatch[0]);
}