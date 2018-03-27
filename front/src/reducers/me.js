import {
	SAVE_ME,
	UPDATE_ME
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

		case UPDATE_ME:
		return Object.assign({}, state, {
			me: action.userInfos
		})

		default:
		return state
	}
}
