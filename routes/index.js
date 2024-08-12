/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for express server
*/

//	variables necessary for express
const { Page, Parallax } = require('./util/DOM')
const express = require('express')
const router = express.Router()

//
//	Redirects and Misc Endpoints
//

/* GET home page. */
router.get('/',
	async function (req, res, next) {
		const pageDefaults = req.session.pageDefaults
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Home',
			body: `<div class="text-body container py-5">
			<div class="row">
				<div class="col">
					<nav aria-label="breadcrumb" class="bg-body-tertiary rounded-3 p-3 mb-4">
						<ol class="breadcrumb mb-0">
							<li class="breadcrumb-item active" aria-current="page">Home</li>
						</ol>
					</nav>
				</div>
			</div>
			<div class="text-center text-body container py-5">
				Welcome to my newest version of my ExpressJS Starter site!
			</div>
		</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

/* GET home page. */
router.get('/parallax',
	async function (req, res, next) {
		const pageDefaults = req.session.pageDefaults
		const parallax = new Parallax({ link: "https://science.nasa.gov/wp-content/uploads/2023/09/web-first-images-release.png?w=2048&format=webp"})
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Parallax',
			body: `<div class="text-body container py-5">
			<div class="row">
				<div class="col">
					<nav aria-label="breadcrumb" class="bg-body-tertiary rounded-3 p-3 mb-4">
						<ol class="breadcrumb mb-0">
							<li class="breadcrumb-item" aria-current="page"><a href="/">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">Parallax Demo</li>
						</ol>
					</nav>
				</div>
			</div>
			<div class="text-center text-body container py-5">
				Welcome to my newest version of my ExpressJS Starter site!
			</div>
			<div class="rounded-1">
				${parallax.render()}
			</div>
			<div class="text-center text-body container py-5">
				Welcome to my newest version of my ExpressJS Starter site!
			</div>
			<div class="rounded-1">
				${parallax.render()}
			</div>
			<div class="text-center text-body container py-5">
				Welcome to my newest version of my ExpressJS Starter site!
			</div>
			<div class="rounded-1">
				${parallax.render()}
			</div>
			<div class="text-center text-body container py-5">
				Welcome to my newest version of my ExpressJS Starter site!
			</div>
		</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

router.get('/status', function (req, res, next) {
	res.sendStatus(200)
})

module.exports = router
