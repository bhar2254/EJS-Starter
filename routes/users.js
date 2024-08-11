/*	users.js
  EJS Starter Site, https://ejs-starter.blaineharper.com
  by Blaine Harper

  PURPOSE: Routing for /users/...
*/

//	variables necessary for express
const express = require('express')
const router = express.Router()
const { Page } = require('./util/DOM')
const { SQLObject } = require('./util/sql')
const { requiresAuth } = require('express-openid-connect');

const nextLevelExp = (exp) => {
	return (calculateLevel(exp) + 1) ** 2
}

const calculateLevel = (exp) => {
	return (Math.sqrt(exp) || 0) + 1
}

//  check if user has logged in before
const checkForAccount = async (req, res, next) => {
	const user = new SQLObject({ table: 'users', email: req.oidc.user.email, primaryKey: 'email', ...req.oidc.user })
	const data = await user.read()
	if (data === 0)
		user.create()
	if (data !== 0)
		user.update()
	req.session.currentUser = user
	next()
}

/* GET users page. */
router.get('/me',
	requiresAuth(),
	checkForAccount,
	async function (req, res) {
		const currentUser = req.session.currentUser
		const pageDefaults = req.session.pageDefaults
		const page = new Page({
			...pageDefaults,
			pageTitle: 'My Profile',
			body: `<div class="text-body container py-5">
    <div class="row">
      <div class="col">
        <nav aria-label="breadcrumb" class="bg-body-tertiary rounded-3 p-3 mb-4">
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Users</li>
            <li class="breadcrumb-item active" aria-current="page">Me</li>
          </ol>
        </nav>
      </div>
    </div>
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
            <div class="d-flex justify-content-center mb-2">
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Full Name</p>
              </div>
              <div class="col-sm-9">
                <p class="mb-0">${currentUser.name}</p>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Email</p>
              </div>
              <div class="col-sm-9">
                <p class="mb-0">${currentUser.email} ${currentUser.email_verified ? '' : ' (not verified) '}</p>
              </div>
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
