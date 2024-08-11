/*	sql.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Useful functions and variables used for building SQL queries throughout the application
*/

/*	Custom classes

#	SQL Queries
	-	SQLObject(id, table, options)
		>	Used for single object queries to a SQL database
		>	Single CRUD functions
	-	SQLObjectType(table)
		>	Used for other SQL classes for loading object types from SQL database

module exports 
	queryPromise: queryPromise,
	SQLObject: SQLObject
*/

const { currentTime } = require('./time')
const { safeAssign } = require('./harper')
require('dotenv').config()

DB = require('../../db/sql_connect')

/*	Function for using async DB.query 	*/
const queryPromise = (str) => { 
	return new Promise((resolve, reject) => {
		DB.query(str, (err, result, fields) => {
			if (err) reject(err) 
			resolve(result)
		})
	})
}

// 	Middleware for loading SQL into env variables

//
//	SQL PATCH / POST FUNCTIONS
//

//	for converting from data (int) to human readable
//	these are the defaults.
//	in the future the SQLType class will be able to update and keep track of these.
//	loaded in this script manually, but later can be loaded by accessing sql database

class SQLObject {
	constructor(args){
		const _args = {...args}
		this._read = false
//		set other options from args
		Object.keys(_args).map(key => {
			this[key] = _args[key]
		})
	}
//	set the SQL table, checking the SQLObejctTypes to validate
	set table(table){
		return this._table = table
	}
//	return the store private _var
	get table(){
		return this._table
	}
	get labels(){
		return this._labels
	}
	set properties(properties) {
		this._properties = properties
	}
	get properties(){
		return this._properties
	}
	set primaryKey(primaryKey){
		this._primaryKey = primaryKey
	}
	get primaryKey() {
		return this._primaryKey
	}
	async initialize(){
		if(this._initialized)
			return this._properties
		
		const propertyQuery = `SELECT DATA_TYPE, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${process.env.DB_DB}' AND TABLE_NAME = '${this._table}';`
		const propertyQueryResponse = await queryPromise(propertyQuery)

		const primaryKeyQuery = `SHOW KEYS FROM ${this._table} WHERE KEY_NAME = 'PRIMARY';`
		const primaryKeyResponse = await queryPromise(primaryKeyQuery)

		if(primaryKeyResponse[0] && !this._primaryKey)
			this.primaryKey = primaryKeyResponse[0].Column_name

		const properties = {}
		for(const each of propertyQueryResponse){
			const key = each.COLUMN_NAME
			properties[key] = safeAssign(() => each.DATA_TYPE) || 'undefined'
		}
		this.properties = properties

		this._initialized = true
		return this.properties
	}
//	Insert into SQL db and update this.id
//		If this.id = 0, it's a new object and will need updated
//		Create should return data.insertId from data = queryPromise(...)
	async create(args){
		const _args = { ...args }
		if(!this._initialized)
			await this.initialize()

//		if args are set, build the object from them
//			checking table properties to ensure it's valid
		for(const key of Object.keys(this.properties))
			if(_args[key] && !this[key])
				this[key] = _args[key]

		this.update_displayName = _args.update_displayName || this.update_displayName

//		assume that the object has been built properly and send properties to SQL db
//			use every property that isn't prefixed with _
//			data = await queryPromise(...,{}) 
		let sqlQuery = `INSERT INTO ${this._table} (`
		let insertIndex = 0
		for(const elem of Object.keys(this)){
			if(elem.substring(0,1) == '_' ||
				!Object.keys(this.properties).includes(elem) ||
				!this[elem]
			)
				continue
			if(insertIndex){
				sqlQuery += ', '
			}
			sqlQuery += `\`${elem}\``
			insertIndex++
		}
		insertIndex = 0
		sqlQuery += `) VALUES (`
		for(const elem of Object.keys(this)) {
			if(elem.substring(0,1) == '_' ||
				!Object.keys(this.properties).includes(elem) ||
				!this[elem]
			)
				continue
		
			if(insertIndex)
				sqlQuery += ', '
			sqlQuery += `"${this[elem]}"`
			insertIndex++
		}
		sqlQuery += ')'
		this._lastSQLQuery = sqlQuery
		let data = await queryPromise(sqlQuery)
		this.id = this.table != 'users' ? data.insertId : this.sso_id
		
		return this._lastSQLResponse = data
	}
//	Read from db and load object properties
	async read(){
		if(!this._initialized)
			await this.initialize()
		
//		data = await queryPromise(...,{}) 
//		if data.length = 0, this.create(args)
//			otherwise foreach data set properties from DB
		const table = this.table

//		time conversions
//			for each datetime in SQL, add the datetime_format to query
		let timeConversion = ''
		for (const key of Object.keys(this._properties)) {
			if(this.properties[key] == 'date')
				timeConversion += `, DATE_FORMAT(${key}, '${date_format}') AS ${key}`
			if(this.properties[key] == 'datetime')
				timeConversion += `, DATE_FORMAT(${key}, '${datetime_format}') AS ${key}`
		}
		
		let sqlQuery = `SELECT *${timeConversion} FROM ${table} WHERE ${this.primaryKey} = "${this[this.primaryKey]}";`
		
		let data = await queryPromise(sqlQuery)

		this._lastSQLQuery = sqlQuery

		if(!data.length)
			return 0
		
		let loadData = data[0]
		Object.keys(loadData).forEach(elem => {
//			initilizate the public vars if necessary
			this[elem] = this[elem] || loadData[elem]
//			populate the _private vars always
			this['_'+elem] = loadData[elem]
		})

		this._read = true
		return this._lastSQLResponse = loadData		
	}
//	Filter user scopes and update object in DB
	async update(args){
		if(!this._initialized)
			await this.initialize()

//		First, read from the DB to check the current state of the object
//			this will *not* overwrite the currently set public vars
//			only the private vars used for update sync
		if(!this._read)
			await this.read()

		for(const key of Object.keys(this._properties)){
			let s=new String(this[key])
			if (s.indexOf('"') != -1)
				s=s.replace(/"/g, `\"`)
			if (s.indexOf("'") != -1)
				s=s.replace(/'/g, `\'`)
			if(key.substring(0,1) != '_')
				this[key]=s
		}

//		if args exists, update the object before updating DB 
//			filter values that don't match the properties in SQL
		if(args)
			for(const key of Object.keys(args))
				this[key] = args[key]

		this.update_time = currentTime()

//		Convert all current parameters without _ to db update query
//		data = await queryPromise(...,{}) 
		let sqlQuery = `UPDATE ${this._table} SET `
		let initialCounter = 0
		let logCounter = 0
		for(const elem of Object.keys(this)){
			const addToLog = !elem.includes('update') && !elem.includes('create')
			const skipUpdate = this[elem] == 'null' ||
				this[elem] === '' ||
				this[elem] == null ||
				elem.substring(0,1) === '_' ||
				this[elem] == this[`_${elem}`] ||
				elem == this._primaryKey ||
				!Object.keys(this._properties).includes(elem)
			if(skipUpdate)
				continue
			
			sqlQuery += initialCounter > 0 ? ', ':''
			sqlQuery += `\`${elem}\` = "${this[elem]}"`
			if(addToLog){
				logCounter++
			}
			initialCounter++
		}
		sqlQuery += ` WHERE ${this._primaryKey} = "${this._id}";`
		
		if(logCounter == 0)
			return this._updateCounter = logCounter

		if(logCounter > 0){
			this._lastSQLQuery = sqlQuery
			this._lastSQLResponse = await queryPromise(sqlQuery)

			this._updateCounter = logCounter
			return this._lastSQLResponse
		}
	}
//	Do delete the object from the database
	async destroy(){
		if(!this._initialized)
			await this.initialize()

//		data = await queryPromise(...,{}) 
		let sqlQuery = `DELETE FROM ${this._table} WHERE ${this._key} = "${this._id}";`
		await queryPromise(sqlQuery)
		this._lastSQLQuery = sqlQuery
		console.log('you can can delete this object from memory ! goodbye')
		return 1
	}
}

// 	Export functions for later use
module.exports={
	queryPromise: queryPromise,
	SQLObject: SQLObject,
}