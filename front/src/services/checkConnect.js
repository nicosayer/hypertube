import { fetchWrap } from './fetchWrap'
import { logMe } from '../actions/me'

export function checkConnect() {
	fetchWrap('/isUserLoggedIn', {
		method: 'GET',
		credentials: 'include'
	})
	.then((payload) => {
		this.props.dispatch(logMe(payload))
	})
	.catch(() => {})
}
