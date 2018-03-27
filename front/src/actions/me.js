import { connectSocket } from './socket'

export const SAVE_ME = 'SAVE_ME'
export const UPDATE_ME = 'UPDATE_ME'

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
