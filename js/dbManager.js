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

	static connect(dbConnection) {
		dbConnection.connect(err => {
			if (err) {
				console.error(`Error connecting to db.`);
				console.error(err);
				return;
			}
			console.log("Successfully connected to db.");
		});
	}

	static end(dbConnection) {
		dbConnection.end(err => {
			if (err) {
				console.error("An error occured ending the database connection.");
				console.error(err);
				return;
			}
			console.log("Successfully closed database connection.");
		});
	}
}