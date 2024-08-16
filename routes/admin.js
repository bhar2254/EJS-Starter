/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for express server
*/

//	variables necessary for express
const { Page, Breadcrumb, Table } = require('./util/DOM')
const fetch = require('../fetch')
const express = require('express')
const { SQLObject } = require('./util/sql')
const router = express.Router()

router.get('/signout',
	async function (req, res, next) {
		req.session.currentUser = null
		res.redirect('/logout')
})

/* GET home page. */
router.get('/',
	async function (req, res, next) {
		const validKeys = ['id','name','email','nickname','role','email_verified','exp']
		const pageDefaults = req.session.pageDefaults
		const breadcrumb = new Breadcrumb({
			'Home': null
		})
		const users = new SQLObject({table:'users', all:true})
		const usersData = await users.read()
		const tableData = usersData.map(user => {
			const response = {}
			validKeys.map(x => {
				return response[x] = x == 'name' ? 
					`<a class="btn btn-primary" href="/users/profile/${user.guid}">${user[x]}</a>`:
					user[x] 

			})
			return response
		})
		const userTable = new Table({data: tableData})
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Home',
			body: `<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
						<div class="text-body container p-4">
							${breadcrumb.render()}
							<div class="text-center text-body container p-4 my-5">
								<div class="row">
									<div class="mx-auto col-12 text-center mb-5">
										Welcome to the Admin Center!
									</div>
								<div>
								<div class="row">
									<div class="mx-auto table-responsive col-12">
										${userTable.render()}
									</div>
								</div>	
							</div>
						</div>
					</div>
				</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

module.exports = router
