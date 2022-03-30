'use strict';

const mysql = require('mysql');

module.exports = class DbManager
{
	static getConnection() {
		return mysql.createConnection({
			host: process.env.NIMMT_DB_HOST,
			database: process.env.NIMMT_DB_NAME,
			user: process.env.NIMMT_DB_USER,
			password: process.env.NIMMT_DB_PASSWORD
		});
	}
}