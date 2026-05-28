import { useState, useEffect } from 'react'

export default function PageParsing({ onSuccess, onFallback }) {
  const [step, setStep] = useState(0)
  const steps = [
    { id: 1, icon: '🤖', text: '读取简历文本...' },
    { id: 2, icon: '🔍', text: '分析职场偏好维度...' },
    { id: 3, icon: '✨', text: '生成画像参数...' }
  ]

  useEffect(() => {
    // Simulate parsing process
    const timer1 = setTimeout(() => setStep(1), 800)
    const timer2 = setTimeout(() => setStep(2), 1800)
    const timer3 = setTimeout(() => {
      setStep(3)
      // After all steps complete, go to tuning
      onSuccess({
        overwork: 5,
        care: 6,
        leadership: 5,
        competition: 5,
        process: 5,
        growth: 6,
        innovation: 5,
        worklife: 5
      })
    }, 2800)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div id="page-parsing" className="page active">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">正在解析你的简历</h1>
          <p className="page-subtitle">AI 正在阅读并分析你的职场偏好</p>
        </div>

        <div className="parsing-steps">
          {steps.map((s, i) => (
            <div key={s.id} className={`parsing-step ${i <= step ? 'completed' : ''}`}>
              <div className="agent-icon">{i < step ? '✓' : s.icon}</div>
              <div className="agent-text">{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}