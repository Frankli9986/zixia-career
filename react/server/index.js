import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// DeepSeek API proxy - keeps API key server-side
app.post('/api/parse-resume', async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText || resumeText.trim().length < 20) {
    return res.status(400).json({ error: '简历内容过短或缺失' });
  }

  const API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-34dP43LGhS3nyiKfKT4S1y7Jgb7e8vN2mRx4UwXp2Zq6Hc9LkFsTmYo8A9d';

  try {
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
{
  "overwork": 数字,      // 加班接受度，1=准时下班，10=全力投入
  "care": 数字,          // 人文关怀，1=目标导向，10=人情味浓
  "leadership": 数字,    // 领导风格，1=决策集中，10=平等对话
  "competition": 数字,   // 竞争压力，1=合作共进，10=优胜劣汰
  "process": 数字,      // 流程规范，1=灵活应变，10=制度完善
  "growth": 数字,        // 成长空间，1=深耕细作，10=快速晋升
  "innovation": 数字,    // 创新自由度，1=循规蹈矩，10=鼓励创新
  "worklife": 数字       // 工作生活平衡，1=工作为核，10=生活优先
}

只输出JSON，不要其他内容。
简历内容：
${resumeText.substring(0, 3000)}`
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      // Validate all keys are present and in range
      const requiredKeys = ['overwork', 'care', 'leadership', 'competition', 'process', 'growth', 'innovation', 'worklife'];
      for (const key of requiredKeys) {
        if (typeof result[key] !== 'number' || result[key] < 1 || result[key] > 10) {
          throw new Error(`Invalid value for ${key}`);
        }
      }
      res.json(result);
    } else {
      throw new Error('无法解析 DeepSeek 返回内容');
    }
  } catch (error) {
    console.error('DeepSeek API error:', error.message);
    res.status(500).json({ error: '简历解析失败，请稍后重试或选择直接答题模式' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});