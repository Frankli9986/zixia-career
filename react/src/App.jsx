import { useGame } from './GameContext'
import Onboarding from './Onboarding'
import Simulator from './Simulator'
import Ending from './Ending'

export default function App() {
  const { state } = useGame()
  const { screen } = state

  return (
    <>
      {screen === 'onboarding' && <Onboarding />}
      {screen === 'simulator' && <Simulator />}
      {screen === 'ending' && <Ending />}
    </>
  )
}