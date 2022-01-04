const mysql = require('mysql');
const color = require('colors');

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

conexion.connect((error) => {
    if(error){
        throw error; 
    }else{
        console.log('Conexion exitosa'.red);
    }
});

module.exports = conexion;