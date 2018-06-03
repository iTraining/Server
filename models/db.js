const config = require('../config/config');
const Promise = require('bluebird');
const mysql = require('mysql');


Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);


let dbconf = Object.assign({ connectionLimit: 10 }, config.mysql);
let Pool = mysql.createPool(dbconf);


exports.queryDb = (sql, values) => {
	let promise = Pool.queryAsync(sql, values);
	return promise;
}


