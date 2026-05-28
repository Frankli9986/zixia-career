import { useGame } from './GameContext'
import { PARAMS, getTopTraits, COMMITTEE, IMPRINTS } from './data'

export default function Ending() {
  const { state, dispatch } = useGame()
  const { params, week, route, fit, energy, imprints, history } = state.gameState

  const finalValues = state.gameState.params || params
  const topTraits = getTopTraits(finalValues)

  // Calculate final stats
  const weeksPassed = week
  const choicesMade = history.length
  const averageParam = Object.values(finalValues).reduce((a, b) => a + b, 0) / 8

  const getEndingTitle = () => {
    if (fit >= 70) return '找到方向'
    if (fit >= 50) return '重新出发'
    return '继续探索'
  }

  const getEndingText = () => {
    if (fit >= 70) {
      return `这12周像是一场加速版的职业生涯。你做出了很多选择，有些是对的，有些是错的。但最重要的是，你开始知道自己是什么样的人、适合什么样的环境。`
    }
    if (fit >= 50) {
      return `这12周并不总是顺利，但你一直坚持下去。你对自己的了解在慢慢加深。也许还没找到答案，但问题正在变得清晰。`
    }
    return `这段旅程还没有给你完整的答案。但这不重要——重要的是你开始提问了。你已经比三个月前的自己更了解职场是什么、你要的是什么。`
  }

  return (
    <div className="screen active">
      <style>{`
        .ending-screen {
          background: #0f0e17;
          color: #f0e6d3;
          min-height: 100vh;
          font-family: 'Noto Sans SC', 'Noto Serif SC', sans-serif;
        }
        .ending-section {
          background: #1a1825;
          border: 1px solid #2a2838;
          padding: 20px;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 11px;
          color: #6b6560;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
      `}</style>

      <div className="ending-screen" style={{
        background: '#0f0e17',
        color: '#f0e6d3',
        minHeight: '100vh',
        padding: '48px 24px 80px',
        fontFamily: "'Noto Sans SC', 'Noto Serif SC', sans-serif"
      }}>
        <h2 style={{
          fontFamily: "'Noto Serif SC', serif",
          fontSize: '28px',
          color: '#e8b86d',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          {getEndingTitle()}
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#a89f91',
          fontSize: '13px',
          marginBottom: '40px',
          fontFamily: "'Noto Serif SC', serif",
          fontStyle: 'italic'
        }}>
          三个月试用期结束
        </p>

        {/* Summary section */}
        <div className="ending-section">
          <h3 className="section-title">旅程统计</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#232130' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#e8b86d' }}>
                {weeksPassed}
              </div>
              <div style={{ fontSize: '11px', color: '#6b6560', marginTop: '4px' }}>
                周数
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', background: '#232130' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#e8b86d' }}>
                {choicesMade}
              </div>
              <div style={{ fontSize: '11px', color: '#6b6560', marginTop: '4px' }}>
                选择
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', background: '#232130' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#e8b86d' }}>
                {imprints.length}
              </div>
              <div style={{ fontSize: '11px', color: '#6b6560', marginTop: '4px' }}>
                印记
              </div>
            </div>
          </div>
        </div>

        {/* Traits section */}
        <div className="ending-section">
          <h3 className="section-title">你的特质</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {topTraits.map((trait, i) => (
              <div key={i} style={{
                background: '#232130',
                border: '1px solid #2a2838',
                padding: '8px 14px',
                fontSize: '12px'
              }}>
                <span style={{ color: '#e8b86d', fontWeight: 500 }}>{trait}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Imprints section */}
        {imprints.length > 0 && (
          <div className="ending-section">
            <h3 className="section-title">获得印记</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {imprints.map((imprint, i) => {
                const imprintData = IMPRINTS[imprint]
                return imprintData ? (
                  <div key={i} style={{
                    background: '#232130',
                    border: '1px solid #2a2838',
                    padding: '8px 14px',
                    fontSize: '12px'
                  }}>
                    <div style={{ color: '#e8b86d', fontWeight: 500 }}>
                      {imprintData.name}
                    </div>
                    <div style={{ color: '#6b6560', fontSize: '11px', marginTop: '2px' }}>
                      {imprintData.desc}
                    </div>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Final params radar */}
        <div className="ending-section">
          <h3 className="section-title">最终画像</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px'
          }}>
            {PARAMS.map(param => (
              <div key={param.key} style={{
                textAlign: 'center',
                padding: '12px',
                background: '#232130',
                fontSize: '11px'
              }}>
                <div style={{ color: '#6b6560', marginBottom: '4px' }}>
                  {param.name}
                </div>
                <div style={{ color: '#e8b86d', fontSize: '18px', fontWeight: 700 }}>
                  {finalValues[param.key]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result text */}
        <div className="ending-section">
          <h3 className="section-title">结论</h3>
          <p style={{
            fontSize: '14px',
            lineHeight: 1.9,
            color: '#a89f91',
            fontFamily: "'Noto Serif SC', serif",
            fontStyle: 'italic'
          }}>
            {getEndingText()}
          </p>
        </div>

        {/* Actions */}
        <div style={{ padding: '0 20px 40px' }}>
          <button
            style={{
              display: 'block',
              width: '100%',
              padding: '14px',
              background: '#e8b86d',
              color: '#0f0e17',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Noto Sans SC', sans-serif"
            }}
            onClick={() => dispatch({ type: 'RESET_ALL' })}
          >
            重新开始旅程
          </button>
          <button
            style={{
              display: 'block',
              width: '100%',
              padding: '14px',
              background: 'transparent',
              color: '#a89f91',
              border: '1px solid #2a2838',
              fontSize: '14px',
              marginTop: '8px',
              cursor: 'pointer',
              fontFamily: "'Noto Sans SC', sans-serif"
            }}
            onClick={() => window.location.reload()}
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}