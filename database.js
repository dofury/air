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
    search: async (req,res) => {
        query('SELECT * FROM ticket',(error,rows)=>{
            if(error) throw error;
            return rows;
        });
    }
}
 
module.exports = mysqlConnection;