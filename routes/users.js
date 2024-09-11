/*	users.js
  EJS Starter Site, https://ejs-starter.blaineharper.com
  by Blaine Harper

  PURPOSE: Routing for /users/...
*/

//	variables necessary for express
const express = require('express')
const router = express.Router()
const { Page, Breadcrumb } = require('./util/DOM')
const { downloadImage } = require('./util/cacheImages')
const { requiresAuth } = require('express-openid-connect')
const { SQLObject } = require('./util/sql')
const { cacheFetch } = require('./util/harper')

const authenticationMethods = {
	'google-oauth2': 'Google',
	'github': 'GitHub'
}

const nextLevelExp = (exp) => {
	return Math.round((calculateLevel(exp) + 1) ** 2)
}

const calculateLevel = (exp) => {
	return Math.round((Math.sqrt(exp) || 0) + 1)
}

const generateProfileCard = (profileData) => {
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
	const options = profileData.options || {}
	const _profileData = {
		guid: profileData.guid || String(),
		editable: profileData.editable || false,
		higher_role: profileData.higher_role || false ? 'editable' : String(),
		editable_on_admin: profileData.editable_on_admin || false  ? 'editable' : String(),
		picture: profileData.picture || String(),
		name: profileData.name || String(),
		nickname: profileData.nickname || String(),
		email: profileData.email || String(),
		email_verified: profileData.email_verified || false,
		exp: profileData.exp || 0,
		id: profileData.id || 0,
		sub: profileData.sub || false ? authenticationMethods[String(profileData.sub).split('|')[0]] : String(),
		role: profileData.role || 'Default'
	}
	const editButtons = _profileData.editable ? 
		`<div class="row mx-auto p-3">
			<button type="button" onclick="toggleForm()" class="editable-toggler btn bh-primary">Edit</button>
			<div class="btn-group">
				<button type="button" onclick="cancelForm()" class="editable-toggler btn bh-dark-grey" style="display:none;">Cancel</button>
				<button type="submit" class="editable-toggler btn bh-primary" style="display:none;">Save</button>
			</div>
		</div>` :
		''
	return `<div class="row g-4">
				<div class="col-lg-4">
					<div class="card bg-glass-primary-3 shadow-lg">
						<div class="card-body text-center">
							<img src="/images/profiles/${profileData.guid || ''}.webp" alt="avatar" class="rounded-circle img-fluid" style="width: 150px;">
							<br>
							<h5 class="my-3">${_profileData.nickname}</h5>
							<p class="mb-0">Level ${calculateLevel(_profileData.exp)} (${_profileData.exp} / ${nextLevelExp(_profileData.exp)})</p>
						</div>
					</div>
				</div>
				<div class="col-lg-8">
					<form method="post" action="/update/users/${_profileData.guid}">
						<div class="card bg-glass-primary-3 shadow-lg">
							<div class="card-body">
								${profileRows({
									'Full Name': `<span id="name" class="editable">${_profileData.name}</span>`,
									'Nickname': `<span id="nickname" class="editable">${_profileData.nickname}</span>`,
									'Email': `<span id="email" class="${_profileData.editable_on_admin || ''}">${_profileData.email}</span> ${_profileData.email_verified ? '' : ' (not verified) '}`,
									'Picture URL': `<span id="picture" class="editable">${_profileData.picture}</span>`,
									'Authentication Method': `${_profileData.sub}`,
									'Role': `<span id="role" data-type="select" data-tag="select" data-options='${String(options.roles || null)}' class="${_profileData.higher_role || _profileData.editable_on_admin || ''}">${_profileData.role || 'Default'}</span>`
								})}
							</div>
							${editButtons}
						</div>
					</form>
				</div>
			</div>`
}

/* GET users page. */
router.post('/',
	async function (req, res) {
		return res.redirect('/admin')
})

/* GET users page. */
router.get('/profile/:identifier',
	requiresAuth(),
	async function (req, res) {
		const currentUser = req.session.currentUser
		let identifier = req.params.identifier
		const apod = await cacheFetch('nasa_apod', `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
		
		downloadImage(apod.url, `./public/images/cache`, apod.guid);

		if(identifier === "me")
			identifier = currentUser.guid
		const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
		const isValidGuid = guidRegex.test(identifier);
		let profileUser
		if(!isValidGuid)
			profileUser = new SQLObject({table: 'users', primaryKey: 'nickname', nickname: identifier})
		if(isValidGuid)
			profileUser = new SQLObject({table: 'users', primaryKey: 'guid', guid: identifier})
		await profileUser.read()
		if(isValidGuid)
			return res.redirect(`/users/profile/${profileUser.nickname}`)

		const breadcrumbObj = {
			'Home': '/',
			'Users': currentUser.isAdmin ? '/admin' : null,
			'Profile': null
		}
		breadcrumbObj[profileUser.nickname] = null
		const breadcrumb = new Breadcrumb(breadcrumbObj)
		breadcrumb.addClass('mb-3')

		const role = Math.max(Number(currentUser.role), Number(profileUser.role))

		const rolesFull = req.session.meta.roles
		const roles = rolesFull.slice(0, role + 1)

		const profileData = { 
			...profileUser,
			options: {
				'roles': JSON.stringify(roles)
			},
			editable: ( currentUser.role > profileUser.role && currentUser.isAdmin ) || currentUser.id == profileUser.id,
			higher_role: currentUser.role >= profileUser.role,
			editable_on_admin: currentUser.isAdmin,
			role: req.session.meta.roles[Number(profileUser.role)]
		}
		const profileCard = generateProfileCard(profileData)

		const pageDefaults = req.session.pageDefaults
		const page = new Page({
			...pageDefaults,
			header: {
				...pageDefaults.header,
				append: pageDefaults.header.append + `
					<style>
						body {
							background-image: url('https://storage.blaineharper.com/api/images?url=${process.env.URI}/images/cache/${apod.guid}.webp');
						}
					</style>`
			},
			pageTitle: profileUser.name,
			body: `
				<div class='m-5 mx-auto bg-glass bg-gradient  shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
					<div class="text-body container p-4">
						${breadcrumb.render()}
						<div class="text-body">
							${profileCard}
						</div>
					</div>
				</div>`
		})
		req.session.returnTo = `/users/profile/${profileUser.guid}`
		res.render('pages/blank', { content: page.render() })
	}
)

module.exports = router
