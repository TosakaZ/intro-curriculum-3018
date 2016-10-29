'use strict';
const http = require('http');
const server = http.createServer((req, res) => {
  const now = new Date().getTime();
  let counts = 1;
  if (req.url === '/favicon.ico') {   // chrome の二重アクセス対策
    return;
  } else {
    if (req.headers.cookie) {
      const map = new Map();
      const cookies = req.headers.cookie.split(';');
      for (let i = 0; i < cookies.length; i = i + 1)
        map.set(cookies[i].split('=')[0].trim(), cookies[i].split('=')[1]);   // 2番目のクッキーに半角空白
          // Map { 'access_counts' => '1', ' last_access' => '1477704265201' }
      counts = map.get('access_counts') * 1 + 1;
    }
  }
  // setHeader より前に writeHead すると Error: Can't set headers after they are sent. って怒られる
  res.setHeader('Set-Cookie', ['last_access=' + now + ';expires=Mon, 07 Jan 2036 00:00:00 GMT;','access_counts=' + counts + ';expires=Mon, 07 Jan 2036 00:00:00 GMT;']);
  res.writeHead(200, {'Content-Type': 'text/html', 'charset': 'utf-8'});
  res.end('<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><title></title></head></body><h1>あなたの訪問回数は ' + counts + ' 回目です。</h1></body></html>');
  //res.end(req.headers.cookie);
});
const port = 8000;
server.listen(port, () => {
  console.info('Listening on ' + port);
});

