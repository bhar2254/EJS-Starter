/*	users.js
  EJS Starter Site, https://ejs-starter.blaineharper.com
  by Blaine Harper

  PURPOSE: Routing for /users/...
*/

//	variables necessary for express
const express = require('express')
const router = express.Router()
const { Page, Breadcrumb } = require('./util/DOM')
const { requiresAuth } = require('express-openid-connect')
const { SQLObject } = require('./util/sql')
const { cacheFetch } = require('./util/harper')

const nextLevelExp = (exp) => {
	return Math.round((calculateLevel(exp) + 1) ** 2)
}

const calculateLevel = (exp) => {
	return Math.round((Math.sqrt(exp) || 0) + 1)
}

/* GET users page. */
router.post('/',
	async function (req, res) {
		return res.redirect('/admin')
})

/* GET users page. */
router.post('/update',
	requiresAuth(),
	async function (req, res) {
		const updateUser = new SQLObject({table: 'users', id: req.body.id})
		await updateUser.read()
		if(updateUser._email != req.body.email){
			updateUser.sid = 'null'
			updateUser.sub = null
		}
		await updateUser.update({...req.body})
		if(req.session.currentUser.id == updateUser.id)
			req.session.currentUser = updateUser
		return res.redirect(req.session.returnTo)
})

/* GET users page. */
router.get('/me',
	requiresAuth(),
	async function (req, res) {
		const currentUser = req.session.currentUser
		const apod = await cacheFetch('nasa_apod', `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
		const breadcrumb = new Breadcrumb({
			'Home': '/',
			'Users': currentUser.isAdmin ? '/admin' : null,
			'Me': null
		})
		breadcrumb.addClass('mb-3')
		const profileRows = (args) => {
			const _args = {...args}
			const response = []
			Object.keys(_args).forEach(key => {
				response.push(`
						<div class="row g-4">
							<div class="col-sm-3">
								<p class="mb-0 text-white">${key}</p>
							</div>
							<div class="col-sm-9">
								<p class="mb-0 text-white">${_args[key]}</p>
							</div>
						</div>`)
			})
			return response.join('<hr>')
		}
		const pageDefaults = req.session.pageDefaults
		const role = req.session.meta.roles[Number(currentUser.role)]
		const editable_on_admin = currentUser.isAdmin ? 'editable' : ''
		const page = new Page({
			...pageDefaults,
			pageTitle: 'My Profile',
			header: {
				...pageDefaults.header,
				append: pageDefaults.header.append + `
<style>
	body {
		background-image: url('${apod.url}');
	}
</style>`
			},
			body: `
<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
	<div class="text-body container p-4">
	  	${breadcrumb.render()}
		<div class="text-body">
			<div class="row g-4">
				<div class="col-lg-4">
					<div class="card bg-glass-primary-3 shadow-lg">
						<div class="card-body text-center">
							<img src="${currentUser.picture}" alt="avatar" class="rounded-circle img-fluid" style="width: 150px;">
							<br>
							<h5 class="my-3">${currentUser.nickname}</h5>
							<p class="mb-0">Level ${calculateLevel(currentUser.exp)} (${currentUser.exp} / ${nextLevelExp(currentUser.exp)})</p>
						</div>
					</div>
				</div>
				<div class="col-lg-8">
					<form method="post">
						<div class="card bg-glass-primary-3 shadow-lg">
							<div class="card-body">
								<input name="id" style="display:none;" value="${currentUser.id}"></input>
								${profileRows({
									'Full Name': `<span id="name" class="editable">${currentUser.name}</span>`,
									'Email': `<span id="email" class="${editable_on_admin}">${currentUser.email}</span> ${currentUser.email_verified ? '' : ' (not verified) '}`,
									'Picture URL': `<span id="picture" class="editable">${currentUser.picture}</span>`,
									'Authentication Method': `${currentUser.sub}`,
									'Role': `<span id="role" class="">${role}</span>`
								})}
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
	</div>
</div>`
		})
		req.session.returnTo = '/users/me'
		res.render('pages/blank', { content: page.render() })
	}
)

/* GET users page. */
router.post('/me',
	requiresAuth(),
	async function (req, res) {
		const currentUser = req.session.currentUser
		const updateUser = new SQLObject({table: 'users', id: currentUser.id})
		if(currentUser.email != req.body.email){
			updateUser.sid = 'null'
			updateUser.sub = null
		}
		await updateUser.update({id: currentUser.id, ...req.body})
		req.session.currentUser = updateUser
		return res.redirect('/users/me')
})

/* GET users page. */
router.get('/profile/:guid',
	requiresAuth(),
	async function (req, res) {
		const currentUser = req.session.currentUser
		const profileUser = new SQLObject({table: 'users', primaryKey: 'guid', guid: req.params.guid})
		await profileUser.read()
		const breadcrumbObj = {
			'Home': '/',
			'Users': currentUser.isAdmin ? '/admin' : null,
			'Profile': null
		}
		breadcrumbObj[currentUser.nickname] = null
		const breadcrumb = new Breadcrumb(breadcrumbObj)
		breadcrumb.addClass('mb-3')
		const profileRows = (args) => {
			const _args = {...args}
			const response = []
			Object.keys(_args).forEach(key => {
				response.push(`
						<div class="row g-4">
							<div class="col-sm-3">
								<p class="mb-0 text-white">${key}</p>
							</div>
							<div class="col-sm-9">
								<p class="mb-0 text-white">${_args[key]}</p>
							</div>
						</div>`)
			})
			return response.join('<hr>')
		}
		const edit_buttons = currentUser.isAdmin || currentUser.id == profileUser.id ? `<button type="button" onclick="toggleForm()" class="editable-toggler btn bh-primary">Edit</button>
								<div class="btn-group">
									<button type="button" onclick="cancelForm()" class="editable-toggler btn bh-dark-grey" style="display:none;">Cancel</button>
									<button type="submit" class="editable-toggler btn bh-primary" style="display:none;">Save</button>
								</div>` : ''
		const editable_on_admin = currentUser.isAdmin ? 'editable' : ''
		const pageDefaults = req.session.pageDefaults
		const role = req.session.meta.roles[Number(profileUser.role)]
		const page = new Page({
			...pageDefaults,
			pageTitle: profileUser.name,
			body: `
<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
	<div class="text-body container p-4">
	  	${breadcrumb.render()}
		<div class="text-body">
			<div class="row g-4">
				<div class="col-lg-4">
					<div class="card bg-glass-primary-3 shadow-lg">
						<div class="card-body text-center">
							<img src="${profileUser.picture}" alt="avatar"
							class="rounded-circle img-fluid" style="width: 150px;">
							<br>
							<h5 class="my-3">${profileUser.nickname}</h5>
							<p class="mb-0">Level ${calculateLevel(profileUser.exp)} (${profileUser.exp} / ${nextLevelExp(profileUser.exp)})</p>
						</div>
					</div>
				</div>
				<div class="col-lg-8">
					<form method="post" action="/users/update">
						<div class="card bg-glass-primary-3 shadow-lg">
							<div class="card-body">
								<input name="id" style="display:none;" value="${profileUser.id}"></input>
								${profileRows({
									'Full Name': `<span id="name" class="editable">${profileUser.name}</span>`,
									'Email': `<span id="email" class="${editable_on_admin}">${profileUser.email}</span> ${profileUser.email_verified ? '' : ' (not verified) '}`,
									'Picture URL': `<span id="picture" class="editable">${profileUser.picture}</span>`,
									'Authentication Method': `${profileUser.sub}`,
									'Role': `<span id="role" class="">${role}</span>`
								})}
							</div>
							<div class="row mx-auto p-3">
								${edit_buttons}
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>`
		})
		req.session.returnTo = `/users/profile/${profileUser.guid}`
		res.render('pages/blank', { content: page.render() })
	}
)

module.exports = router
