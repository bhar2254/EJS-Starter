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

module exports 
	queryPromise: queryPromise,
	SQLObject: SQLObject
*/

const datetime_format = '%Y-%m-%dT%H:%i'
const date_format = '%Y-%m-%d'

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

const safeAssign = (valueFn, catchFn) => {
	try {
		return valueFn()
	} catch (e) {
		if (catchFn) catchFn(e)
		return null
	}
}

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
				!this[elem])
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
		
		data = await this.read()

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
		
		const where = typeof this.all == 'undefined' ? `WHERE ${this.primaryKey} = "${this[this.primaryKey]}"` : `` 
		const sqlQuery = `SELECT *${timeConversion} FROM ${table} ${where};`
		
		const data = await queryPromise(sqlQuery)

		if(!data.length)
			return 0
		
		const firstRow = data[0]
		Object.keys(firstRow).forEach(elem => {
//			initilizate the public vars if necessary
			this[elem] = this[elem] || firstRow[elem]
//			populate the _private vars always
			this['_'+elem] = firstRow[elem]
		})

		this._last =  {
			query: sqlQuery,
			response: data,
		}

		this._read = true
		return data
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

//		Convert all current parameters without _ to db update query
//		data = await queryPromise(...,{}) 

		const table = this._table.substring(0,4).includes('view') ? this._table.substring(4) : this._table

		const setValues = Object.keys(this).filter((x) => (!x.includes('update') && 
			!x.includes('create') && 
			this[x] != 'undefined' && 
			this[x] != 'null' && 
			this[x] != null && 
			x.substring(0,1) != '_' && 
			this[x] != this[`_${x}`] && 
			x != this._primaryKey && 
			Object.keys(this._properties).includes(x)
		)).map(x => `\`${x}\` = "${this[x].replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\0/g, '\\0')}"`)

		if(setValues.length == 0)
			return 0

		const whereStmt = typeof this.all == 'undefined' ? `WHERE ${this._primaryKey} = "${this[this._primaryKey]}"` : ''
		let sqlQuery = `UPDATE ${table} SET ${setValues.join(', ')} ${whereStmt};`
	
		this._last = {
			query: sqlQuery,
			response: await queryPromise(sqlQuery)
		}

		return this._last.response
	}
//	Do delete the object from the database
	async destroy(){
		if(!this._initialized)
			await this.initialize()

//		data = await queryPromise(...,{}) 
		let sqlQuery = `DELETE FROM ${this._table} WHERE ${this._primaryKey} = "${this[this._primaryKey]}";`
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