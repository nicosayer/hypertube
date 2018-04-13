export const SAVE_ME = 'SAVE_ME';
export const UPDATE_ME = 'UPDATE_ME';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const CHANGE_SEARCH = 'CHANGE_SEARCH';
export const CHANGE_SEARCH_SETTINGS = 'CHANGE_SEARCH_SETTINGS';

export function logMe(me) {
	return ((dispatch) => {
		dispatch(saveMe(me))
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

export function changeSearch(search) {
	return {
		type: CHANGE_SEARCH,
		search
	}
}

export function changeSearchSettings(name, value) {
	return {
		type: CHANGE_SEARCH_SETTINGS,
		name,
		value
	}
}
