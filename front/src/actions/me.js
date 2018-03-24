import { connectSocket } from './socket'

export const SAVE_ME = 'SAVE_ME'

export function logMe(me) {
	return ((dispatch) => {
		dispatch(saveMe(me))
		dispatch(connectSocket())
	})
}

function saveMe(me) {
	return {
		type: SAVE_ME,
		me
	}
}
