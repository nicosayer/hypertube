export function fetchWrap(...args) {
  return fetch(...args).then(response => {
   if ((response.headers.get("content-type") === null || response.headers.get("content-type").indexOf('application/json') === -1) && response.ok) return Promise.resolve()
    else if (response.headers.get("content-type") === null || response.headers.get("content-type").indexOf('application/json') === -1) return Promise.reject()
    else {
      return response.json().then(json => {
        return response.ok ? json : Promise.reject(json);
      });
    }
  });
}