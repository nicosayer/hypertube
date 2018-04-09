import {
	SAVE_ME,
	UPDATE_ME,
	CHANGE_LANGUAGE
} from '../actions/me'

export function handleMe(
	state = {
		me: {},
		isAuthenticated: false,
		language: 'en'
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

		case CHANGE_LANGUAGE:
		return Object.assign({}, state, {
			language: action.language
		})

		default:
		return state
	}
}
