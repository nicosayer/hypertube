import { connectSocket } from './socket'

export const SAVE_ME = 'SAVE_ME';
export const UPDATE_ME = 'UPDATE_ME';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const CHANGE_SEARCH_SETTINGS = 'CHANGE_SEARCH_SETTINGS';

export function logMe(me) {
	return ((dispatch) => {
		dispatch(saveMe(me))
		dispatch(connectSocket())
	})
}

export function updateProfileInfos(userInfos) {
	return {
		type: UPDATE_ME,
		userInfos
	}
}

function saveMe(me) {
	return {
		type: SAVE_ME,
		me
	}
}

export function changeLanguage(language) {
	return {
		type: CHANGE_LANGUAGE,
		language
	}
}

export function changeSearchSettings(name, value) {
	return {
		type: CHANGE_SEARCH_SETTINGS,
		name,
		value
	}
}
