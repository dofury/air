const router = require('express').Router();
const mysqlConnection = require('./database');
const conection = mysqlConnection.init();
const reqTicket = require('./reqTicket');
mysqlConnection.open(conection);
const util = require('./utility');
const https = require('https');
const axios = require('axios');

https.globalAgent.options.rejectUnauthorized = false;
const airPorts = ['AAR', 'ABL', 'ASV', 'ESR', 'FGW', 'JJA', 'JNA', 'KAL', 'TWB', 'HGG'];

router.get('/get', async function (request, response) {
    let reqData;
    if (request.query != null)//쿼리 데이터가 null이 아니면 데이터를 넣음
    {
        reqData = new reqTicket.ReqTicket(request.query.depName, request.query.arrName, request.query.date);
    }
    let data = await mysqlConnection.search(conection, reqData);

    let result = {
        data: null,
        code: {
            message: null,
            status: null
        }
    };

    if (data) {
        console.log(result.code.message);
        result.code.status = "CODE000"
        result.code.message = "데이터 있음"
    }
    else {
        await axios({
            method: 'GET',
            url: 'https://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getFlightOpratInfoList?',
            responseType: 'JSON',
            rejectUnauthorized: false
        }).then(async function (response) {
            try {
                const result = await axios.get('https://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getFlightOpratInfoList?serviceKey=' + process.env.SERVICE_KEY, {
                    params: {
                        pageNo: '1',
                        numOfRows: '10',
                        _type: 'json',
                        depAirportId: util.trans(reqData.depName).toString(),
                        arrAirportId: util.trans(reqData.arrName).toString(),
                        depPlandTime: reqData.date,
                    }
                })
                let items = result.data.response.body.items;
                if (items.item != null) {
                    for (let item of items.item)//날짜는 같으나 시간대가 다른 티켓 반복 추가
                    {
                        try {
                            mysqlConnection.save(conection, item);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
                result.code.status = "CODE200"
                result.code.message = "예외발생"
            }
        });
        


        data = await mysqlConnection.search(conection, reqData, function (result) {
            var dataList = [];
            for (var data of result) {
                dataList.push(data);
            }
            console.log(dataList);
        });
        if (data == 0) {
            result.code.status = "CODE500"
            result.code.message = "연계 API에서 데이터를 못 받아옴"
            console.log(result.code.message);
        }
        else {
            result.code.status = "CODE000"
            result.code.message = "데이터가 없어서 받아서 저장한 뒤 정상적으로 불러옴"
            console.log(result.code.message);
        }
    }
    //CODE000 -> 정상
    //CODE200 -> 예외 발생
    //CODE300 -> 서버 점검중
    //CODE500 -> 연계 API 문제
    //CODE600 -> 데이터베이스 연결 안됨
    
    result.data = data

    response.json(result);

});

module.exports = router;