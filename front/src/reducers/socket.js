import {
	SOCKET_SUCCESS
} from '../actions/socket'

export function connectSocket(
	state = {
		socket: {},
		isConnect: false
	},
	action
) {
	switch(action.type) {
		case SOCKET_SUCCESS:
		return Object.assign({}, state, {
			socket: action.socket,
			isConnect: true
		})
		default:
		return state
	}
}
