import { useState, useEffect } from 'react'
import { useGame } from './GameContext'
import { PARAMS, QUIZ, COMMITTEE, getTopTraits } from './data'

// Page components
import PageUpload from './pages/PageUpload'
import PageParsing from './pages/PageParsing'
import PageQuiz from './pages/PageQuiz'
import PageTuning from './pages/PageTuning'
import PageConfirm from './pages/PageConfirm'
import PageTransition from './pages/PageTransition'

const PAGES = ['upload', 'parsing', 'quiz', 'tuning', 'confirm', 'transition']

export default function Onboarding() {
  const { state, dispatch } = useGame()
  const [pageIndex, setPageIndex] = useState(0)
  const [toast, setToast] = useState(null)

  const currentPage = PAGES[pageIndex]

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const goToPage = (index) => {
    if (typeof index === 'string') {
      index = PAGES.indexOf(index)
    }
    setPageIndex(index)
  }

  const goNext = () => goToPage(pageIndex + 1)
  const goPrev = () => {
    if (pageIndex > 0) goToPage(pageIndex - 1)
  }

  // Handle profile updates from child components
  const handleProfileSet = (values) => {
    dispatch({ type: 'UPDATE_PROFILE_VALUES', payload: values })
  }

  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' })
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'upload':
        return (
          <PageUpload
            onParsed={handleProfileSet}
            onSkip={() => {
              handleProfileSet({})
              goToPage('tuning')
            }}
            showToast={showToast}
            goToParsing={() => goToPage('parsing')}
          />
        )
      case 'parsing':
        return (
          <PageParsing
            onSuccess={(values) => {
              handleProfileSet(values)
              goToPage('tuning')
            }}
            onFallback={() => {
              goToPage('quiz')
            }}
          />
        )
      case 'quiz':
        return (
          <PageQuiz
            onComplete={() => goToPage('tuning')}
            onBack={() => goToPage('upload')}
            goToPage={goToPage}
          />
        )
      case 'tuning':
        return (
          <PageTuning
            onConfirm={() => goToPage('confirm')}
            onBack={() => goToPage('quiz')}
          />
        )
      case 'confirm':
        return (
          <PageConfirm
            onStart={handleStartGame}
            onBack={() => goToPage('tuning')}
            onAdjust={() => goToPage('tuning')}
          />
        )
      case 'transition':
        return (
          <PageTransition
            onExplore={handleStartGame}
            onBack={() => goToPage('confirm')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="screen active">
      {renderPage()}
      {toast && <div className={`toast show`}>{toast}</div>}
    </div>
  )
}