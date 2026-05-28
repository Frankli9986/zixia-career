import { useState, useEffect } from 'react'
import { useGame } from './GameContext'
import { EVENT_POOL, ROUTE_EVENTS, COUNCIL_PERSONALITY, PARAMS, COMMITTEE } from './data'

export default function Simulator() {
  const { state, dispatch } = useGame()
  const { params, week, route, energy, imprints, history } = state.gameState
  const [currentEvent, setCurrentEvent] = useState(null)
  const [showRouteEvent, setShowRouteEvent] = useState(false)
  const [routeEvent, setRouteEvent] = useState(null)

  // Start game and show first event
  useEffect(() => {
    loadRandomEvent()
  }, [])

  // Check for route events at specific weeks
  useEffect(() => {
    if ([3, 6, 9, 12].includes(week)) {
      const routeKey = `after_week_${week}`
      if (ROUTE_EVENTS[routeKey]) {
        setRouteEvent(ROUTE_EVENTS[routeKey])
        setShowRouteEvent(true)
      }
    }
    if (week > 12) {
      dispatch({ type: 'SET_SCREEN', payload: 'ending' })
    }
  }, [week])

  const loadRandomEvent = () => {
    // Filter events that can appear at this week
    const availableEvents = EVENT_POOL.filter(e => 
      e.week.some(w => w >= week)
    )
    
    if (availableEvents.length === 0) {
      if (week > 12) {
        dispatch({ type: 'SET_SCREEN', payload: 'ending' })
      }
      return
    }

    const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)]
    setCurrentEvent(randomEvent)
  }

  const handleChoice = (choice) => {
    // Apply effects
    const newParams = { ...params }
    if (choice.eff) {
      Object.entries(choice.eff).forEach(([key, val]) => {
        if (newParams[key] !== undefined) {
          newParams[key] = Math.max(1, Math.min(10, newParams[key] + val))
        }
      })
    }
    
    dispatch({ type: 'UPDATE_PROFILE_VALUES', payload: newParams })

    // Advance week after choice
    dispatch({ type: 'ADVANCE_WEEK' })
    
    // Load next event
    setTimeout(() => {
      loadRandomEvent()
    }, 300)
  }

  const handleRouteChoice = (choice) => {
    if (choice.route) {
      dispatch({ type: 'SET_ROUTE_CHOICE', payload: choice.route })
    }
    setShowRouteEvent(false)
    setRouteEvent(null)
    loadRandomEvent()
  }

  // Get council voices for current situation
  const getCouncilVoices = () => {
    if (!currentEvent) return []
    
    // Pick 2-3 random committee members to comment
    const shuffled = [...COMMITTEE].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 2)
    
    return selected.map(member => {
      const keyMap = {
        '加班委员': 'overwork',
        '人文委员': 'care',
        '领导委员': 'leadership',
        '竞争委员': 'competition',
        '流程委员': 'process',
        '成长委员': 'growth',
        '创新委员': 'innovation',
        'WLB委员': 'worklife'
      }
      
      const paramKey = keyMap[member.name]
      const paramValue = params[paramKey] || 5
      
      // Randomly pick an opinion
      const opinions = COUNCIL_PERSONALITY[paramKey]
      const opinion = Math.random() > 0.5 
        ? opinions.agree[Math.floor(Math.random() * opinions.agree.length)]
        : opinions.disagree[Math.floor(Math.random() * opinions.disagree.length)]
      
      return {
        speaker: member.name,
        text: opinion
      }
    })
  }

  // Render route event modal
  if (showRouteEvent && routeEvent) {
    return (
      <div className="screen active">
        <div className="container">
          <div className="header-section">
            <h1 className="route-title">路口</h1>
            <p className="route-week">第 {week} 周</p>
          </div>

          <div className="event-scene">
            <p className="scene-setting">{routeEvent.scene}</p>
            <div className="scene-text">
              {routeEvent.text.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="choices">
            {routeEvent.choices.map((choice, i) => (
              <button
                key={i}
                className="choice-btn"
                onClick={() => handleRouteChoice(choice)}
              >
                <div>{choice.text}</div>
                <div className="choice-flavor">{choice.flavor}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Main game view
  return (
    <div className="screen active">
      {/* Dark theme for game - override CSS variables */}
      <style>{`
        .sim-screen {
          --bg: #0f0e17;
          --bg-card: #1a1825;
          --text: #f0e6d3;
          --text-secondary: #a89f91;
          --text-tertiary: #6b6560;
          --accent: #e8b86d;
          --accent-dark: #c9a96e;
          --border: #2a2838;
          font-family: 'Noto Sans SC', sans-serif;
        }
      `}</style>
      
      <div className="sim-screen" style={{
        background: '#0f0e17',
        color: '#f0e6d3',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: "'Noto Sans SC', sans-serif"
      }}>
        {/* Status bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            background: '#1a1825',
            border: '1px solid #2a2838',
            padding: '6px 14px',
            fontSize: '11px',
            color: '#a89f91'
          }}>
            第 <b style={{ color: '#e8b86d' }}>{week}</b> 周
          </span>
          <span style={{
            background: '#1a1825',
            border: '1px solid #2a2838',
            padding: '6px 14px',
            fontSize: '11px',
            color: '#a89f91'
          }}>
            精力 <b style={{ color: '#e8b86d' }}>{energy}</b>
          </span>
          <span style={{
            background: '#1a1825',
            border: '1px solid #2a2838',
            padding: '6px 14px',
            fontSize: '11px',
            color: '#a89f91'
          }}>
            印记 <b style={{ color: '#e8b86d' }}>{imprints.length}</b>
          </span>
        </div>

        {/* Route indicator */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '11px',
          color: '#6b6560',
          letterSpacing: '2px'
        }}>
          当前路线：<span style={{ color: '#e8b86d', fontWeight: 500 }}>
            {route === 'tech' ? '技术深耕' : route === 'social' ? '人际经营' : '平衡发展'}
          </span>
        </div>

        {/* Event area */}
        {currentEvent && (
          <>
            <div style={{
              background: '#1a1825',
              border: '1px solid #2a2838',
              marginBottom: '20px'
            }}>
              <div style={{
                padding: '12px 18px',
                borderBottom: '1px solid #2a2838',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#6b6560',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                <span>随机事件</span>
                <span style={{ color: '#e8b86d' }}>第 {week} 周</span>
              </div>
              
              <div style={{
                padding: '24px 20px',
                fontFamily: "'Noto Serif SC', serif",
                fontSize: '15px',
                lineHeight: 2.2,
                color: '#f0e6d3'
              }}>
                <p style={{
                  color: '#a89f91',
                  fontSize: '13px',
                  marginBottom: '16px',
                  fontStyle: 'italic'
                }}>
                  {currentEvent.scene}
                </p>
                <div style={{ whiteSpace: 'pre-wrap' }}>{currentEvent.text}</div>
              </div>
            </div>

            {/* Council voices */}
            <div style={{
              background: '#232130',
              borderTop: '1px solid #2a2838',
              padding: '20px'
            }}>
              <div style={{
                fontSize: '10px',
                color: '#8b7bb5',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                内心委员会
              </div>
              
              {getCouncilVoices().map((voice, i) => (
                <div key={i} className="council-voice">
                  <span className="speaker">{voice.speaker}</span>: {voice.text}
                </div>
              ))}
            </div>

            {/* Choices */}
            <div style={{ padding: '0 20px 20px' }}>
              {currentEvent.choices.map((choice, i) => (
                <button
                  key={i}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px 18px',
                    background: 'transparent',
                    color: '#f0e6d3',
                    border: '1px solid #2a2838',
                    textAlign: 'left',
                    fontSize: '14px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: "'Noto Sans SC', sans-serif",
                    lineHeight: 1.7
                  }}
                  onClick={() => handleChoice(choice)}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#e8b86d'
                    e.target.style.background = 'rgba(232,184,109,0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#2a2838'
                    e.target.style.background = 'transparent'
                  }}
                >
                  <div>{choice.text}</div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b6560',
                    marginTop: '4px',
                    fontStyle: 'italic'
                  }}>
                    {choice.flavor}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}