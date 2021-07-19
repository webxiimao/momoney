import request from 'request';

export const get = url => new Promise((resolve, reject) => {
request.get(url, (err, _request, body) => {
  if (err) {
    reject(err);
  } else {
    resolve(body);
  }
});
  });
