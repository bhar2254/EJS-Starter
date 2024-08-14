/*	users.js
  EJS Starter Site, https://ejs-starter.blaineharper.com
  by Blaine Harper

  PURPOSE: Routing for /users/...
*/

//	variables necessary for express
const express = require('express')
const router = express.Router()
const { Page, Breadcrumb } = require('./util/DOM')
const { requiresAuth } = require('express-openid-connect');

const nextLevelExp = (exp) => {
	return Math.round((calculateLevel(exp) + 1) ** 2)
}

const calculateLevel = (exp) => {
	return Math.round((Math.sqrt(exp) || 0) + 1)
}

/* GET users page. */
router.get('/me',
	requiresAuth(),
	async function (req, res) {
		const currentUser = req.session.currentUser
		const subTypes = {
			'google-oauth2': 'Google',
			'github': 'GitHub',
		}
		const subSplit = currentUser.sub.split('|')
		const breadcrumb = new Breadcrumb({
			'Home': '/',
			'Users': null,
			'Me': null
		})
		breadcrumb.addClass('mb-3')
		const profileRows = (args) => {
			const _args = {...args}
			const response = []
			Object.keys(_args).forEach(key => {
				response.push(`
						<div class="row">
							<div class="col-sm-3">
								<p class="mb-0">${key}</p>
							</div>
							<div class="col-sm-9">
								<p class="mb-0"><span id="picture" class="editable">${_args[key]}</span></p>
							</div>
						</div>`)
			})
			return response.join('<hr>')
		}
		const pageDefaults = req.session.pageDefaults
		const page = new Page({
			...pageDefaults,
			pageTitle: 'My Profile',
			body: `
<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
	<div class="text-body container p-4">
	  	${breadcrumb.render()}
		<div class="text-body">
			<div class="row">
				<div class="col-lg-4">
					<div class="card mb-4">
					<div class="card-body text-center">
						<img src="${currentUser.picture}" alt="avatar"
						class="rounded-circle img-fluid" style="width: 150px;">
						<br>
						<a class="btn bh-primary mt-3" href="http://en.gravatar.com/emails/">Edit photo</a>
						<h5 class="my-3">${currentUser.nickname}</h5>
						<p class="mb-4">Level ${calculateLevel(currentUser.exp)} (${currentUser.exp} / ${nextLevelExp(currentUser.exp)})</p>
					</div>
				</div>
			</div>
			<div class="col-lg-8">
				<form action="/" method="get">
					<div class="card mb-4">
					<div class="card-body">
						${profileRows({
							'Full Name': `<span id="name" class="editable">${currentUser.name}</span>`,
							'Email': `<span id="picture" class="editable">${currentUser.email}</span> ${currentUser.email_verified ? '' : ' (not verified) '}`,
							'Picture URL': `<span id="picture" class="editable">${currentUser.picture}</span>`,
							'Authentication Method': `<span id="sub.method" class="editable">${subTypes[subSplit[0]]}</span>: <span id="sub.id" class="editable">${subSplit[1]}`,
						})}
					</div>
					</div>
				</form>
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
