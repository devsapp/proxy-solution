const { dk } = require('@serverless-devs/dk');
const request = require('request');
const util = require('util')
var http = require('http');


const baseHandler =  async(ctx) => {

  const getClientInfo =(req)=> {
    const ip =  req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

    const ipList = ip.split(":")
    const length = ipList.length;
    const newIp = ipList[length-1]
    return {
      protocol:req.protocol,
      ip:newIp,
      port:req.socket.localPort
    }
  };
  const {protocol,ip,port}= getClientInfo(ctx.req)

  const city = await new Promise((resolve,reject)=>{
    // const proxy = util.format('%s://%s:%d',protocol,ip,port)
    // request({
    //   url:'http://www.nmc.cn/rest/position',
    //   method:'GET',
    //   proxy, 
    // },function(err, httpResponse, body){
    //   console.log('body',body)
    //   if(err){
    //     reject(err)
    //   }else{
    //     const {statusCode}= httpResponse
    //     resolve({
    //       // data:JSON.parse(body),
    //       statusCode
    //     })
    //   }
    // })
    const options = {
      hostname: 'www.nmc.cn',
      port: 80,
      path: '/rest/position',
      method: 'GET',
    };
    const req = http.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        resolve({data:JSON.parse(chunk)})
      });
    });
    req.on('error', (e) => {
      reject(e)
      console.error(`problem with request: ${e.message}`);
    });
    req.end();

  })
  const weatherUrl = `http://www.nmc.cn/rest/weather?stationid=${city.data.code}`
  const weather = await new Promise((resolve,reject)=>{
    request(weatherUrl,function(err, httpResponse, body){
      if(err){
        reject(err)
      }else{
        const {statusCode}= httpResponse
        resolve({
          data:JSON.parse(body),
          statusCode
        })
      }
    })
  })
  return {
    json:weather
  };
};

const handler = dk(baseHandler);

exports.handler = handler;
