const axios = require('axios');
const https = require('https');
const express = require('express');
const util = require('./utility');
const mysqlConnection = require('./database');
const app = express();
const conection = mysqlConnection.init();
const reqTicket = require('./reqTicket');
mysqlConnection.open(conection);
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
        console.log("데이터있어서 보여줌");
        console.log(data);
    }
    else
    {
        axios({
            method: 'GET',
            url: 'https://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getFlightOpratInfoList?',
            responseType: 'JSON',
            rejectUnauthorized : false
        }).then(async function (response){
            try{
                const result = await axios.get('http://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getFlightOpratInfoList?serviceKey='+process.env.SERVICE_KEY,{
                    params: {
                        pageNo: '1',
                        numOfRows: '10',
                        _type: 'json',
                        depAirportId: util.trans(reqData.depName).toString(),
                        arrAirportId: util.trans(reqData.arrName).toString(),
                        depPlandTime: reqData.date,
                        airlineId: 'JNA'
                    }
                })
                var items = result.data.response.body.items;
                mysqlConnection.save(conection,items.item[0]);
                data = await mysqlConnection.search(conection, reqData);
                console.log("데이터없어서 추가하고 보여줌");
                console.log(data);
            }catch(error){
                console.log(error);
            }
        })
    }
});