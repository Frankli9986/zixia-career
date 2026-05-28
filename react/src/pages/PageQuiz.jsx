import { useState, useEffect } from 'react'
import { useGame } from '../GameContext'
import { QUIZ } from '../data'

export default function PageQuiz({ onComplete, onBack, goToPage }) {
  const { state, dispatch } = useGame()
  const [step, setStep] = useState(0)

  // Initialize from default values
  useEffect(() => {
    if (Object.keys(state.profile.values).length === 0) {
      const defaults = {}
      QUIZ.forEach(q => {
        defaults[q.key] = 5
      })
      dispatch({ type: 'UPDATE_PROFILE_VALUES', payload: defaults })
    }
  }, [])

  const currentQuiz = QUIZ[step]
  const totalSteps = QUIZ.length
  const progress = ((step + 1) / totalSteps) * 100

  const handleSelect = (val) => {
    dispatch({
      type: 'UPDATE_PROFILE_VALUES',
      payload: { [currentQuiz.key]: val }
    })

    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div id="page-quiz" className="page active">
      <div className="container">
        <div className="back-btn" onClick={onBack}>← 返回上传</div>
        
        <div className="page-header">
          <h1 className="page-title">回答 8 道题</h1>
          <p className="page-subtitle">让模拟器更懂你</p>
        </div>

        <div className="quiz-progress">
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="quiz-progress-text">第 {step + 1} / {totalSteps} 题</div>
        </div>

        <div className="quiz-question">
          <div className="quiz-q-text">{currentQuiz?.q}</div>
          <div className="quiz-options">
            {currentQuiz?.opts.map((opt, i) => (
              <button
                key={i}
                className="quiz-option-btn"
                onClick={() => handleSelect(opt.val)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}