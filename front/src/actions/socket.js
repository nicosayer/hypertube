import socketIOClient from 'socket.io-client'

export const SOCKET_SUCCESS = 'SOCKET_SUCCESS'

export function connectSocket() {
  return ((dispatch) => {

    const socket = socketIOClient("http://localhost:3001");
    dispatch(socketSuccess(socket))
    
  })
    
}


function socketSuccess(socket) {
  return {
    type: SOCKET_SUCCESS,
    socket
  }
}
