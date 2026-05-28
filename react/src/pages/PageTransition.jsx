import { useGame } from '../GameContext'
import { getTopTraits, COMMITTEE } from '../data'

export default function PageTransition({ onExplore, onBack }) {
  const { state } = useGame()
  const { values } = state.profile
  const topTraits = getTopTraits(values)

  return (
    <div id="page-transition" className="page active">
      <div className="container">
        <div className="back-btn" onClick={onBack}>← 返回</div>

        <div className="page-header">
          <h1 className="page-title">准备好了吗</h1>
          <p className="page-subtitle">未来12周，你将经历这些</p>
        </div>

        <div className="traits-section">
          <p className="section-title">你是什么样的职场人</p>
          <div className="traits-container">
            {topTraits.map((trait, i) => (
              <span key={i} className="trait-tag">{trait}</span>
            ))}
          </div>
        </div>

        <div className="committee-section">
          <p className="section-title">内心的八个声音</p>
          <div className="committee-grid">
            {COMMITTEE.map((c, i) => (
              <div key={i} className="committee-card">
                <div className="committee-name">{c.name}</div>
                <div className="committee-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          background: 'var(--bg-card)', 
          borderRadius: 'var(--radius)', 
          padding: '24px',
          marginBottom: '32px'
        }}>
          <p style={{ 
            fontSize: '14px', 
            lineHeight: 1.8, 
            color: 'var(--text-secondary)',
            marginBottom: '8px'
          }}>
            在这个模拟器里，你会遇到各种职场情境。内心的八个声音会轮流发言，给出不同的建议。
          </p>
          <p style={{ 
            fontSize: '14px', 
            lineHeight: 1.8, 
            color: 'var(--text-secondary)'
          }}>
            你的每个选择都会塑造你的职业路径。没有标准答案，只有最适合你的答案。
          </p>
          <p style={{ 
            marginTop: '16px',
            fontSize: '13px', 
            color: 'var(--text-tertiary)'
          }}>
            ⏱️ 预计体验时间：15-30分钟
          </p>
        </div>

        <div className="bottom-actions">
          <button className="btn btn-primary btn-full" onClick={onExplore}>
            开始探索 →
          </button>
        </div>
      </div>
    </div>
  )
}