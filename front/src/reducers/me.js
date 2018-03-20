import {
  SAVE_ME
} from '../actions/me'

export function handleMe(
  state = {
    me: {},
    isAuthenticated: false
  },
  action
) {
  switch(action.type) {
    case SAVE_ME:
      return Object.assign({}, state, {
        me: action.me,
        isAuthenticated: true
      })
    default:
      return state
  }
}
