/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for express server
*/

//	variables necessary for express
const { Page, Breadcrumb, Table } = require('./util/DOM')
const express = require('express')
const { requiresAuth } = require('express-openid-connect')
const { SQLObject } = require('./util/sql')
const router = express.Router()

String.prototype.capitalizeFirstChar = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

// Using a function to create a subset
function createSubset(obj, keys) {
	return keys.reduce((subset, key) => {
		if (obj.hasOwnProperty(key)) {
			subset[key] = obj[key];
		}
	  	return subset;
	}, {});
}

const tableDefinitions = {
	'meta': ['id','ref','value'],
	'cache': ['id','refresh_time','ref'],
	'posts': ['title','subtitle','update_time'],
	'viewposts': ['name', 'title','subtitle','update_time'],
	'users': ['role','nickname','name','email','email_verified','exp']
}

router.get('/signout',
	async function (req, res, next) {
		req.session.currentUser = null
		res.redirect('/logout')
})

router.post('/create/:table',
	requiresAuth(),
	async function (req, res) {
		const { table } = req.params
		const { role, id } = req.session.currentUser

		const setDefaults = {
			'users': {

			},
			'posts': {
				'author_id': id
			},
			'meta': {

			},
			'cache': {

			},
		}
		const defaults = setDefaults[table] || {}

		let createObject = { table: table, ...req.body, ...defaults }
		createObject = new SQLObject(createObject)

		let preventCreate = false
		const minimum_roles = {
			'users': 4,
			'posts': 2,
			'meta': 5,
			'cache': 5,
		}
		if(minimum_roles[table] > role)
			preventCreate = true

		if(!preventCreate)
			await createObject.create()

		return res.redirect(`/view/${table}/${createObject.guid}`)
})

router.post('/update/:table/:guid',
	requiresAuth(),
	async function (req, res) {
		const { table, guid } = req.params
		const currentUser = req.session.currentUser
		let updateObject = { table: table, primaryKey: 'guid', guid: guid, ...req.body }
		updateObject = new SQLObject(updateObject)
		const data = await updateObject.read()

		let preventUpdate = false
		const tableCallbacks = {
			'users': () => {
				//	reset the role if user doesn't meet criteria
				if(!currentUser.isAdmin || Number(currentUser.role) <= Number(updateObject.role))
					updateObject.role = updateObject._role
			},
			'posts': () => {
				//	check if you're the owner or an admin
				const hasPrivileges = currentUser.isAdmin
				const isOwner = currentUser.users_id == updateObject.author_id
				if(!hasPrivileges && !isOwner)
					preventUpdate = true
			},
			'meta': () => {
				//	refresh the meta if the user has privileges
				const min_role = 5 // a higher than normal minimum. consider scopes lates
				if(currentUser.role < min_role)
					preventUpdate = true
				if(!preventUpdate) {
					req.session.meta[updateObject.ref] = JSON.parse(updateObject.value)
				}
			}
		}
		if(tableCallbacks[table])
			tableCallbacks[table]()

		if(!preventUpdate) {
			await updateObject.update()

			if(guid == currentUser.guid)
				req.session.currentUser = updateObject
		}

		return res.redirect(req.session.returnTo)
})

router.get('/delete/:table/:guid',
	requiresAuth(),
	async function (req, res) {
		const { table, guid } = req.params
		const { role, isAdmin } = req.session.currentUser
		
		let deleteObject = { table: table, primaryKey: 'guid', guid: guid }
		deleteObject = new SQLObject(deleteObject)

		let preventDelete = false
		const minimum_roles = {
			'users': 4,
			'posts': 2,
			'meta': 5,
			'cache': 5,
		}
		const minimum_role = minimum_roles[table] || Number(req.session.meta.min_admin)
		if(minimum_role > role && !isAdmin)
			preventDelete = true

		if(!preventDelete)
			await deleteObject.destroy()

		return res.redirect(`/view/${table}`)
})

router.get('/',
	async function (req, res, next) {
		const pageDefaults = req.session.pageDefaults
		const breadcrumb = new Breadcrumb({
			'Home': null
		})
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Home',
			body: `<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
						<div class="text-body container p-4">
							${breadcrumb.render()}
							<div class="text-center text-body container p-4 my-5">
								<div class="mx-auto col-lg-4 col-md-6 col-sm-11 col-xs-12">
									Welcome to my newest version of my ExpressJS Starter site!
								</div>
							</div>
						</div>
				</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

/* GET home page. */
router.get('/view/:table',
	requiresAuth(),
	async function (req, res, next) {
		const { table } = req.params
		const pageDefaults = req.session.pageDefaults
		const breadcrumbObject = {
			'Home': '/'
		}
		breadcrumbObject[table.capitalizeFirstChar()] = null
		const breadcrumb = new Breadcrumb(breadcrumbObject)

		const tableObject = new SQLObject({ table: `${table}`, all: true })
		const tableData = await tableObject.read()

		const filteredData = tableData.length ? tableData.map( function(x) {
			const keys = Object.keys(x)
			const link = table == 'users' ? `/users/profile/${x.guid}`: `/view/${table}/${x.guid}` 
			for(const key of keys) {
				x[key] = `<a href="${link}">${x[key]}</a>`
			}
			return createSubset(x, tableDefinitions[table] || Object.keys(x)) 
		}): [{empty: 'No Data To Diplay...'}]

		const dataTable = new Table({
			data: filteredData
		})

		const page = new Page({
			...pageDefaults,
			pageTitle: table,
			body: `<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
		<div class="text-body container p-4">
			${breadcrumb.render()}
			<div class="text-center text-body container p-4 my-5">
				<div class="row">
					<div class="mx-auto table-responsive col-12">
						${dataTable.render()}	
					</div>
				</div>
			</div>
		</div>
  </div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

router.get('/view/:table/me',
	requiresAuth(),
	async function (req, res, next) {
		const { table } = req.params
		const pageDefaults = req.session.pageDefaults
		const breadcrumbObject = {
			'Home': '/'
		}
		breadcrumbObject[table.capitalizeFirstChar()] = `/view/${table}`
		breadcrumbObject['Me'] = null
		const breadcrumb = new Breadcrumb(breadcrumbObject)

		const tableObject = new SQLObject({ table: `${table}`, primaryKey: `users_id`, id: req.session.currentUser.id })
		const tableData = await tableObject.read()

		const filteredData = tableData.map( x => createSubset(x, tableDefinitions[table] || Object.keys(x)) )

		const dataTable = new Table({
			data: filteredData
		})

		const page = new Page({
			...pageDefaults,
			pageTitle: table,
			body: `<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
		<div class="text-body container p-4">
			${breadcrumb.render()}
			<div class="text-center text-body container p-4 my-5">
				<div class="row">
					<form>
						<div class="mx-auto table-responsive col-12">
							${dataTable.render()}	
						</div>
					</form>
				</div>
			</div>
		</div>
  </div>`
		})
		req.session.returnTo = req.path
		res.render('pages/blank', { content: page.render() })
	}
)

router.get('/view/:table/:guid',
	requiresAuth(),
	async function (req, res, next) {
		const { table, guid } = req.params
		if(table == 'users')
			return res.redirect('/users/ ')
		const pageDefaults = req.session.pageDefaults
		const currentUser = req.session.currentUser
		const breadcrumbObject = {
			'Home': '/'
		}
		breadcrumbObject[table.capitalizeFirstChar()] = `/view/${table}`
		const breadcrumb = new Breadcrumb(breadcrumbObject)

		let tableObject = { table: `${table}`, primaryKey: `guid`, guid: guid }
		tableObject = new SQLObject(tableObject)
		
		const tableData = await tableObject.read()

		const cardRows = (args) => {
			const _args = {...args}
			const response = []
			Object.keys(_args).forEach(key => {
				if(key != 'guid')
					response.push(`
						<div class="row g-4">
							<div class="col-sm-3">
								<p class="mb-0 text-white">${key}</p>
							</div>
							<div class="col-sm-9">
								<p class="mb-0 text-white"><span class="editable" id="${key}">${_args[key]}</span></p>
							</div>
						</div>`)
			})
			return response.join('<hr>')
		}

		const page = new Page({
			...pageDefaults,
			pageTitle: table,
			body: `<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
		<div class="text-body container p-4">
			${breadcrumb.render()}
			<div class="text-center text-body container p-4 my-5">
				<div class="row">
					<form method="post" action="/update/${table}/${tableData[0].guid}">
						<div class="card bg-glass-primary-3 shadow-lg">
							<div class="card-body">
								${cardRows(tableData[0])}
							</div>
							<div class="row mx-auto p-3">
								<div class="btn-group">
									<a class="editable-toggler btn bh-secondary" href="/view/${table}">Back</a>
									<a class="editable-toggler btn btn-danger" href="/delete/${table}/${guid}">Delete</a>
									<button type="button" onclick="toggleForm()" class="editable-toggler btn bh-primary">Edit</button>
								</div>
								<div class="btn-group">
									<button type="button" onclick="cancelForm()" class="editable-toggler btn bh-dark-grey" style="display:none;">Cancel</button>
									<button type="submit" class="editable-toggler btn bh-primary" style="display:none;">Save</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
  </div>`
		})
		req.session.returnTo = req.path
		res.render('pages/blank', { content: page.render() })
	}
)

module.exports = router
