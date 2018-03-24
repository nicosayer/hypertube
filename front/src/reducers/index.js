import { combineReducers } from 'redux'
import { handleMe } from './me'
import { connectSocket } from './socket'

const rootReducer = combineReducers({
	handleMe, connectSocket
})

export default rootReducer
