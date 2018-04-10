import {
	SAVE_ME,
	UPDATE_ME,
	CHANGE_LANGUAGE
} from '../actions/me'

export function handleMe(
	state = {
		me: {
			language: 'en'
		},
		isAuthenticated: false,
	},
	action
) {
	switch(action.type) {
		case SAVE_ME:
		if (!action.me.language) {
			action.me.language = 'en';
		}
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
			me: {
				...state.me,
				language: action.language
			}
		})

		default:
		return state
	}
}
