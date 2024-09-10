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
	'users': ['id', 'campus_id', 'name','email','role'],
	'vehicles': ['vehicles_id','vehicle_title','color','state','plate', 'permits_id'],
	'permits': ['permits_id', 'permit_type','permit_num','expire','vehicles_id'],
	'tickets': ['tickets_id','ticket_type','user_id','location'],
	'meta': ['id','ref','value'],
}

router.get('/signout',
	async function (req, res, next) {
		req.session.currentUser = null
		res.redirect('/logout')
})

/* GET users page. */
router.post('/update/:table',
	requiresAuth(),
	async function (req, res) {
		const { table } = req.params
		let updateObject = { table: table, primaryKey: 'guid', guid: req.body.guid }
		updateObject = new SQLObject(updateObject)
		console.log({...req.body})
		await updateObject.update()
		return res.redirect(req.session.returnTo)
})

/* GET home page. */
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
					Welcome to Parking on Hills v2!
					<br>
					<br>
					Due to project complexity and flexibility, we've decided to move PoH from its original form to this modern version. Using a new foundation, we're able to integrate PoH with other Indian Hills applications to speed up development and improve our features!
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


		const filteredData = tableData.length ? 
			tableData.map( function(x) {
				const keys = Object.keys(x)
				const link = `/view/${table}/${x.guid}`
				for(const key of keys) {
					x[key] = `<a href="${link}">${x[key]}</a>`
				}
				return createSubset(x, tableDefinitions[table] || Object.keys(x)) 
			}):
			[{Empty:`No Data to Display!`}]

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
		const { currentUser, pageDefaults } = req.session
		console.log(`Current user logged in: ${JSON.stringify(currentUser)}`)
		const breadcrumbObject = {
			'Home': '/'
		}
		breadcrumbObject[table.capitalizeFirstChar()] = `/view/${table}`
		breadcrumbObject['Me'] = null
		const breadcrumb = new Breadcrumb(breadcrumbObject)

		const tableObject = new SQLObject({ table: `${table}`, primaryKey: `users_id`, users_id: currentUser.id })
		const tableData = await tableObject.read()

		const filteredData = tableData.length ?
			tableData.map( x => createSubset(x, tableDefinitions[table] || Object.keys(x)) ) :
			[{Empty:`No Data to Display!`}]

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
					<form method="post" action="/update/${table}">
						<div class="card bg-glass-primary-3 shadow-lg">
							<div class="card-body">
								<input name="guid" style="display:none;" value="${tableData[0].guid}"></input>
								${cardRows(tableData[0])}
							</div>
							<div class="row mx-auto p-3">
								<button type="button" onclick="toggleForm()" class="editable-toggler btn bh-primary">Edit</button>
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
