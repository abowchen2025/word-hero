export const initialGameState = {
  currentStageId: null,
  stars: 0,
  experience: 0,
  mistakes: [],
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'selectStage':
      return { ...state, currentStageId: action.stageId }
    case 'completeStage':
      return {
        ...state,
        stars: state.stars + action.stars,
        experience: state.experience + action.experience,
      }
    case 'reset':
      return initialGameState
    default:
      return state
  }
}
