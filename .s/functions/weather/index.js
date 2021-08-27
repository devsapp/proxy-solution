const { dk } = require('@serverless-devs/dk');
var request = require('request');

const baseHandler =  async(ctx) => {
  const city = await new Promise((resolve,reject)=>{
    request('http://www.nmc.cn/rest/position',function(err, httpResponse, body){
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
  const weatherUrl = `http://www.nmc.cn/rest/weather?stationid=${city.data.code}`
  const weather = await new Promise((resolve,reject)=>{
    request(weatherUrl,function(err, httpResponse, body){
      if(err){
        reject(err)
      }else{
        const {statusCode}= httpResponse
        console.log('body',body)
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
