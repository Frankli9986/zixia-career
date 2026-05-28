import { useEffect, useRef } from 'react'
import { useGame } from '../GameContext'
import { PARAMS, TRAIT_CONFIG, getTopTraits, COMMITTEE } from '../data'

function drawRadar(canvas, values) {
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2
  const radius = Math.min(w, h) / 2 - 20
  
  ctx.clearRect(0, 0, w, h)
  
  // Draw grid lines
  ctx.strokeStyle = '#E5E7EB'
  ctx.lineWidth = 1
  
  for (let r = 0.2; r <= 1; r += 0.2) {
    ctx.beginPath()
    ctx.arc(cx, cy, radius * r, 0, Math.PI * 2)
    ctx.stroke()
  }
  
  // Draw axes
  const labels = PARAMS.map(p => p.name)
  const n = labels.length
  const angleStep = (Math.PI * 2) / n
  
  labels.forEach((_, i) => {
    const angle = i * angleStep - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius
    )
    ctx.stroke()
  })
  
  // Draw data polygon
  const dataPoints = PARAMS.map((p, i) => {
    const angle = i * angleStep - Math.PI / 2
    const val = (values[p.key] || 5) / 10
    return {
      x: cx + Math.cos(angle) * radius * val,
      y: cy + Math.sin(angle) * radius * val
    }
  })
  
  ctx.fillStyle = 'rgba(91, 138, 110, 0.2)'
  ctx.strokeStyle = '#5B8A6E'
  ctx.lineWidth = 2
  
  ctx.beginPath()
  dataPoints.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  
  // Draw points
  ctx.fillStyle = '#5B8A6E'
  dataPoints.forEach(p => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
    ctx.fill()
  })
}

export default function PageConfirm({ onStart, onBack, onAdjust }) {
  const { state } = useGame()
  const { values } = state.profile
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      drawRadar(canvasRef.current, values)
    }
  }, [values])

  const topTraits = getTopTraits(values)

  const getPersonaText = () => {
    const traitTexts = topTraits.join('、')
    return `你是${traitTexts}类型的职场人。你有自己的节奏和偏好，这没有好坏之分，只是特点。在这个模拟器里，你会遇到各种选择——有些会很艰难。请记住：无论结果如何，这些选择帮助你更了解自己。`
  }

  return (
    <div id="page-confirm" className="page active">
      <div className="container">
        <div className="back-btn" onClick={onBack}>← 返回微调</div>
        
        <div className="page-header">
          <h1 className="page-title">你的职场画像</h1>
        </div>

        <div className="radar-container">
          <p className="radar-title">8 维能力雷达图</p>
          <canvas ref={canvasRef} className="radar-chart" width="280" height="280"></canvas>
        </div>

        <div className="persona-desc">
          {getPersonaText()}
        </div>

        <div className="traits-section">
          <p className="section-title">你最重要的三个特质</p>
          <div className="traits-container">
            {topTraits.map((trait, i) => (
              <span key={i} className="trait-tag">{trait}</span>
            ))}
          </div>
        </div>

        <div className="committee-section">
          <p className="section-title">你内心的八个声音</p>
          <p className="section-subtitle">每个问题，他们都会发表意见</p>
          <div className="committee-grid">
            {COMMITTEE.map((c, i) => (
              <div key={i} className="committee-card">
                <div className="committee-name">{c.name}</div>
                <div className="committee-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bottom-actions">
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={onAdjust}>重新调整</button>
            <button className="btn btn-primary" onClick={onStart}>开始探索 →</button>
          </div>
        </div>
      </div>
    </div>
  )
}