/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for express server
*/

//	variables necessary for express
const { Page, Breadcrumb } = require('./util/DOM')
const express = require('express')
const router = express.Router()

router.get('/signout',
	async function (req, res, next) {
		req.session.currentUser = null
		res.redirect('/logout')
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
					Welcome to my newest version of my ExpressJS Starter site!
				</div>
			</div>
		</div>
  </div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

module.exports = router
