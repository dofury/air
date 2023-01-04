const { query } = require('express');
const mysql = require('mysql'); 

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
    search: function (con,item) {
        const date = item.depPlandTime.toString().substr(0,7)
        const depTime = item.depPlandTime.toString().substr(8,11)
        const arrTime = item.arrPlandTime.toString().substr(8,11)
        var sql = "INSERT INTO ticket(ticketNum,ticketName,airlineName,depAirportName,arrAirportName,ticketCharge,ticketDate,depTime,arrTime)"
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
    }
}
 
module.exports = mysqlConnection;