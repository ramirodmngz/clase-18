import mysql from 'mysql2';
import ENVIROMENT from './enviroment.config.js';

//npm install mysql2

const pool = mysql.createPool({
    host : ENVIROMENT.MYSQL.HOST,
    user : ENVIROMENT.MYSQL.USERNAME,
    password: ENVIROMENT.MYSQL.PASSWORD,
    database: ENVIROMENT.MYSQL.DB_NAME,
    // connectionLimit: 5,
})

const promisePool = pool.promise();

export default promisePool;