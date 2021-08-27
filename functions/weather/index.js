const { dk } = require('@serverless-devs/dk');
const request = require('request');

const baseHandler =  async(ctx) => {
  //获取fc clientIp
  const ip = ctx.req.clientIP 
  
  const city = await new Promise((resolve,reject)=>{
    const options = {
      url:'http://www.nmc.cn/rest/position',
      headers:{
        'X-Forwarded-For':ip
      },
    };
    request(options,function(err, httpResponse, body){
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
        resolve({
          data:JSON.parse(body),
          statusCode
        })
      }
    })
  })

  return {
    json:{
      ip,
      city,
      weather
    }
  };
};

const handler = dk(baseHandler);

exports.handler = handler;
