const { query } = require('express');
const mysql = require('mysql'); 

/*
AAR - 아시아나 항공
ABL - 에어부산
ASV - 에어서울
ESR - 이스타항공
FGW - 플라이 강원
JJA - 제주항공
JNA - 진에어
KAL - 대한항공
TWB - 티웨이항공
HGG - 하이에어
 */

const mysqlConnection = {
    init: function() {
        return mysql.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '008244',
            database: 'airData',
        });
    },
    open: function(con) {
        con.connect(err => {
            if (err) {
                console.log('MySQL connection error : ', err);
            } else {
                console.log('MySQL connected!');
            }
        });
    },
    close: function(con) {
        con.end(err => {
            if (err) {
                console.log("MySQL termination error : ", err);
            } else {
                console.log("MySQL terminated...");
            }
        });
    },
    save: function (con,item) {
        const date = item.depPlandTime.toString().substr(0,8)
        const depTime = item.depPlandTime.toString().substr(8,11)
        const arrTime = item.arrPlandTime.toString().substr(8,11)
        let sql = "INSERT INTO ticket(ticketNum,ticketName,airlineName,depAirportName,arrAirportName,ticketCharge,ticketDate,depTime,arrTime)"
        + "VALUES (NULL,"
        + "'" + item.vihicleId + "',"
        + "'" + item.airlineNm + "',"
        + "'" + item.depAirportNm + "',"
        + "'" + item.arrAirportNm + "',"
        + "'" + item.economyCharge + "',"
        + "'" + date + "',"
        + "'" + depTime + "',"
        + "'" + arrTime + "')";
        con.query(sql, function(err,result){
            if(err) throw err;      
            else
            {
                console.log("1 record INSERT!"); 
            }
            
        });
    },
    search: async function (con,ticket) {
        let sql = "SELECT * FROM ticket WHERE " 
        + "depAirportName = " + "'" + ticket.depName + "'" + " AND "
        + "arrAirportName = " + "'" + ticket.arrName + "'" + " AND "
        + "ticketDate = " + "'" + ticket.date + "' ORDER BY ticketCharge ASC";
        return new Promise((resolve)=>{
            con.query(sql, function(err,result) {

                if(err) throw err;      
                else
                {
                    if(!Object.keys(result).length == 0)//데이터가 있다면
                    {
                        resolve(result);
    
                        
                    }
                    else
                    {
                        resolve(0);
                    }
                }
            });
        });
    }
}
 
module.exports = mysqlConnection;