const http = require('http');

const postData = JSON.stringify({
  msg: 'Hello World!',
});

const options = {
  hostname: 'www.nmc.cn',
  port: 80,
  path: '/rest/position',
  method: 'GET',
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Content-Length': Buffer.byteLength(postData),
  // },
};
let cityInfo;
const req = http.request(options, (res) => {
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    cityInfo = chunk;
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// 将数据写入请求正文
req.write(postData);
req.end();

console.log('cityInfo', cityInfo);
