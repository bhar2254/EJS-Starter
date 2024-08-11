/*	sql_connect.js
	EJS-Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Script to setup connection with SQL DATABASE for API.

	SQL DATABASE configuration for server.js
	Make sure to leave the password value null 
	DONT SAVE THE DATABASE PASSWORD TO GITHUB
*/	
require('dotenv').config()
const mysql = require('mysql2');

const pool = mysql.createPool({
	connectionLimit : 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DB
})

module.exports = pool;
