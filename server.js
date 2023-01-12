const axios = require('axios');
const https = require('https');
const express = require('express');
const util = require('./utility');
const mysqlConnection = require('./database');
const app = express();
const conection = mysqlConnection.init();
const reqTicket = require('./reqTicket');
mysqlConnection.open(conection);
const airPorts = ['AAR','ABL','ASV','ESR','FGW','JJA','JNA','KAL','TWB','HGG'];
require('dotenv').config();

https.globalAgent.options.rejectUnauthorized = false;

app.listen(8080, function(){
    console.log('listening on 8080');
});



app.get('/air', async function(request, response){
    var reqData;
    if(request.query != null)//쿼리 데이터가 null이 아니면 데이터를 넣음
    {
        reqData = new reqTicket.ReqTicket(request.query.depName,request.query.arrName,request.query.date);
    }
    var data = await mysqlConnection.search(conection, reqData);
    if(data)
    {
        console.log("데이터 있음");
    }
    else
    {
    for(const airPort of airPorts)// 항공사가 다르고 같은 날짜 티켓
    {
    await axios({
        method: 'GET',
        url: 'https://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getFlightOpratInfoList?',
        responseType: 'JSON',
        rejectUnauthorized : false
    }).then(async function (response){
        try{
            const result = await axios.get('https://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getFlightOpratInfoList?serviceKey='+process.env.SERVICE_KEY,{
                params: {
                    pageNo: '1',
                    numOfRows: '10',
                    _type: 'json',
                    depAirportId: util.trans(reqData.depName).toString(),
                    arrAirportId: util.trans(reqData.arrName).toString(),
                    depPlandTime: reqData.date,
                    airlineId: airPort
                }
            })
            var items = result.data.response.body.items;
            for(var item of items.item)//날짜는 같으나 시간대가 다른 티켓 반복 추가
            {
                try {
                    mysqlConnection.save(conection,item);  
                } catch (error) {
                    console.log(error);
                }
            }
            console.log("데이터없어서 추가");
        }catch(error){
            console.log(error);
        }
    });
    }
    data = await mysqlConnection.search(conection, reqData);
    console.log('데이터 추가해서 있음')
    }
    response.json(data);

    
});