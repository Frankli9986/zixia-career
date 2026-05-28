import { createContext, useContext, useReducer } from 'react';

const GameContext = createContext(null);

const initialState = {
  profile: {
    skipMode: false,
    values: {}
  },
  gameState: {
    week: 1,
    route: 'standard',
    energy: 70,
    satisfaction: 50,
    fit: 50,
    history: [],
    imprints: [],
    committeeTrust: {},
    currentEvent: null,
    phase: 'intro' // intro, event, route_choice, ending
  },
  screen: 'onboarding' // onboarding, simulator, ending
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };

    case 'UPDATE_PROFILE_VALUES':
      return {
        ...state,
        profile: {
          ...state.profile,
          values: { ...state.profile.values, ...action.payload }
        }
      };

    case 'SET_SCREEN':
      return { ...state, screen: action.payload };

    case 'START_GAME':
      return {
        ...state,
        gameState: {
          ...initialState.gameState,
          initialParams: { ...state.profile.values },
          params: { ...state.profile.values }
        },
        screen: 'simulator'
      };

    case 'SET_EVENT':
      return {
        ...state,
        gameState: { ...state.gameState, currentEvent: action.payload }
      };

    case 'MAKE_CHOICE': {
      const { choice } = action.payload;
      const newHistory = [...state.gameState.history, choice];
      const newParams = { ...state.gameState.params };

      // Apply effects
      if (choice.eff) {
        Object.entries(choice.eff).forEach(([key, val]) => {
          if (key === 'energy') {
            // energy is tracked separately
          } else if (newParams[key] !== undefined) {
            newParams[key] = Math.max(1, Math.min(10, newParams[key] + val));
          }
        });
      }

      // Apply energy change
      let newEnergy = state.gameState.energy;
      if (choice.eff && choice.eff.energy) {
        newEnergy = Math.max(0, Math.min(100, newEnergy + choice.eff.energy));
      }

      // Check for week advancement
      let newWeek = state.gameState.week;
      if (choice.advanceWeek) {
        newWeek += 1;
      }

      return {
        ...state,
        gameState: {
          ...state.gameState,
          params: newParams,
          energy: newEnergy,
          history: newHistory,
          week: newWeek,
          currentEvent: null
        }
      };
    }

    case 'ADVANCE_WEEK':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          week: state.gameState.week + 1
        }
      };

    case 'SET_ROUTE_CHOICE':
      return {
        ...state,
        gameState: { ...state.gameState, route: action.payload }
      };

    case 'ADD_IMPRINT':
      if (state.gameState.imprints.includes(action.payload)) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          imprints: [...state.gameState.imprints, action.payload]
        }
      };

    case 'SHOW_ROUTE_EVENT':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          showRouteEvent: action.payload
        }
      };

    case 'CLEAR_ROUTE_EVENT':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          showRouteEvent: null
        }
      };

    case 'RESET_GAME':
      return {
        ...state,
        gameState: { ...initialState.gameState },
        screen: 'onboarding'
      };

    case 'RESET_ALL':
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}

export { initialState };