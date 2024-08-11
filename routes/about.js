/*	users.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Routing for /users/...
*/

//	variables necessary for express
const express = require('express')
const router = express.Router()
const { Page } = require('./util/DOM')

/* GET about page. */
router.get('/',
	async function (req, res) {
		const page = new Page({
			...req.session.pageDefaults,
			pageTitle: 'About',
			body: `<div class="text-body container py-5">
			<div class="row">
				<div class="col">
					<nav aria-label="breadcrumb" class="bg-body-tertiary rounded-3 p-3 mb-4">
						<ol class="breadcrumb mb-0">
							<li class="breadcrumb-item"><a href="/">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">About</li>
						</ol>
					</nav>
				</div>
			</div>
			<div class="text-center text-body container py-5">
				EJS Starter is a template application and demo project for creating new ExpressJS applications with ease. Built-in with scripts for elimiating the worldload as well as EJS teampltes for quick page generation. Create a copy of this project and get started <a href="https://github.com/bhar2254/EJS-Starter">today</a>!
			</div>
		</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

router.get('/developer',
	async function (req, res) {
		const page = new Page({
			...req.session.pageDefaults,
			pageTitle: 'Developer',
			body: `<div class="text-body container py-5">
			<div class="row">
				<div class="col">
					<nav aria-label="breadcrumb" class="bg-body-tertiary rounded-3 p-3 mb-4">
						<ol class="breadcrumb mb-0">
							<li class="breadcrumb-item"><a href="/">Home</a></li>
							<li class="breadcrumb-item"><a href="/about">About</a></li>
							<li class="breadcrumb-item active" aria-current="page">Developer</li>
						</ol>
					</nav>
				</div>
			</div>
			<div class="text-center text-body container py-5">
				Hi! My name's Blaine. I make websites and other JavaScript applications. If you're interested in creating your own JavaScript projects like this one, check out my <a href='https://github.com/bhar2254'>GitHub</a> or check out my site <a href='https://blaineharper.com'>BlaineHarper.com</a> for (possibly?) up to date details.
			</div>
		</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

router.get('/projects',
	async function (req, res) {
		const page = new Page({
			...req.session.pageDefaults,
			pageTitle: 'Projects',
			body: `<div class="text-body container py-5">
			<div class="row">
				<div class="col">
					<nav aria-label="breadcrumb" class="bg-body-tertiary rounded-3 p-3 mb-4">
						<ol class="breadcrumb mb-0">
							<li class="breadcrumb-item"><a href="/">Home</a></li>
							<li class="breadcrumb-item"><a href="/about">About</a></li>
							<li class="breadcrumb-item active" aria-current="page">Projects</li>
						</ol>
					</nav>
				</div>
			</div>
			<div class="text-center text-body container py-5">
				If you'd like to view my other projects, check out my <a href='https://github.com/bhar2254'>GitHub</a>!
			</div>
		</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

module.exports = router
