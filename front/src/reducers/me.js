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
		searchSettings: {
			search: '',
			orderBy: 'popularity.desc',
			release_date_min: 1900,
			release_date_max: 2018,
			ratings_min: 0,
			ratings_max: 10,
			genres: []
		}
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
