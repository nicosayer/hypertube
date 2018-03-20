export const SAVE_ME = 'SAVE_ME'

export function logMe(me) {
  return ((dispatch) => {
    dispatch(saveMe(me))
  })
}

function saveMe(me) {
  return {
    type: SAVE_ME,
    me
  }
}


