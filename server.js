const axios = require('axios');
const https = require('https');
const express = require('express');
const mysqlConnection = require('./database');
const app = express();
const conection = mysqlConnection.init();
mysqlConnection.open(conection);
require('dotenv').config();

https.globalAgent.options.rejectUnauthorized = false;

app.listen(8080, function(){
    console.log('listening on 8080');
});



app.get('/air', async function(request, response){
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
                    depAirportId: 'NAARKPK',
                    arrAirportId: 'NAARKPC',
                    depPlandTime: '20230106',
                    airlineId: 'JNA'
                }
            })
            var items = result.data.response.body.items;
            console.log(items.item[0]);
            mysqlConnection.search(conection,items.item[0]);
        }catch(error){
            console.log(error);
        }
    })
});