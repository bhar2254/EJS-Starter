/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for express server
*/

//	variables necessary for express
const { Card, Page, Breadcrumb } = require('./util/DOM')
const express = require('express')
const { requiresAuth } = require('express-openid-connect');
const url = require('url');
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
		const currentTable = 'viewPosts'
		const pageDefaults = req.session.pageDefaults
		const breadcrumb = new Breadcrumb({
			'Home': '/',
			'Blog': null,
		})
		const posts = new SQLObject({table: currentTable, all: true})
		const data = await posts.read()
		const postThumbnails = data.map(x => {
			const postCard = new Card({
				header: `<div>
							<h3>${x.title}</h3> <span class="small text-muted">${x.subtitle}</span>
						</div>`,
				body: `<div class="text-start">${x.content.split('---')[0]}</div>`,
				footer: `<div class="col mx-auto text-center">
							<div class="btn-group">
								<a class="btn btn-secondary">${x.name == null ? 'Anonymous' : x.name}</a>
								<a class="btn bh-primary" href="/posts/view?id=${x.id}">Read</a>
							</div>
						</div>`,
			})
			return `
				<div class="mx-auto col-lg-4 col-md-6 col-sm-11 col-xs-12">
					${postCard.render()}
				</div>
			`
		}).join(' ')
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Blog',
			body: `<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
		<div class="text-body container p-4">
			${breadcrumb.render()}
			<div class="text-center text-body container p-4 my-5">
				<div class="mx-auto col-lg-4 col-md-6 col-sm-11 col-xs-12 mb-5">
					Here you can browse a sample blog and see any new updates to the website or my projects!
				</div>
				<div class="row g-4"> 
					${postThumbnails}
				</div>
			</div>
		</div>
  </div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

router.get('/view',
	async function (req, res, next) {
		const pageDefaults = req.session.pageDefaults
		const query = req.query 
		const currentTable = 'viewPosts'
		const currentUser = req.session.currentUser
		const post = new SQLObject({table: currentTable, id: query.id, primaryKey: 'id'})
		await post.read()
		const breadcrumbObj = {
			'Home': '/',
			'Blog': '/posts',
		}
		breadcrumbObj[post.title] = null
		const breadcrumb = new Breadcrumb(breadcrumbObj)
		const postCard = new Card({
			header: `<div>
						<h3><span id="title" class="editable">${post.title}<span></h3> <span id="subtitle" class="editable small text-muted">${post.subtitle}</span>
					</div>`,
			body: `<span id="content" class="editable">${post.content}</span>`,
			footer: `<div class="text-center">by ${post.name == null ? 'Anonymous' : post.name} @ ${post.create_time} updated @ ${post.update_time}</div>`,
		})
		const editButtons = post.author_id == currentUser.id ? `
			<div class="row mx-auto p-3">
				<button type="button" onclick="toggleForm()" class="editable-toggler btn bh-primary">Edit</button>
				<div class="btn-group">
					<button type="button" onclick="cancelForm()" class="editable-toggler btn bh-dark-grey" style="display:none;">Cancel</button>
					<button type="submit" class="editable-toggler btn bh-primary" style="display:none;">Save</button>
				</div>
			</div>` : ''
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Blog',
			body: `<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
		<div class="text-body container p-4">
			${breadcrumb.render()}
			<div class="text-center text-body container p-4">
				<div class="mx-auto col-lg-4 col-md-6 col-sm-11 col-xs-12">
					<form method="post" action="/posts/update">
						<input style="display:none;" name="id" value="${post.id}"></input>
						${postCard.render()}
						${editButtons}
					</form>
				</div>
			</div>
		</div>
  </div>`
		})
		req.session.returnTo = url.format({
			pathname: '/posts/view',
			query: req.query
		})
		res.render('pages/blank', { content: page.render() })
	}
)
router.post('/update',
	requiresAuth(),
	async function (req, res) {
		const post = req.body
		const postUpdate = new SQLObject({table: 'posts', id: post.id})
		await postUpdate.update({id: post.id, ...post})
		return res.redirect(req.session.returnTo)
})

router.get('/post/:title',
	async function (req, res, next) {
		const { title } = req.params
		const currentTable = 'viewPosts'
		const currentUser = req.session.currentUser
		const post = new SQLObject({table: currentTable, title: title.replaceAll("+"," "), primaryKey: 'title'}) 
		await post.read()
		const postCard = new Card({
			header: `<div>
						<h3><span id="title" class="editable">${post.title}<span></h3> <span id="subtitle" class="editable small text-muted">${post.subtitle}</span>
					</div>`,
			body: `<span id="content" class="editable">${post.content}</span>`,
			footer: `<div class="text-center">by ${post.name == null ? 'Anonymous' : post.name} @ ${post.create_time} updated @ ${post.update_time}</div>`,
		})
		const pageDefaults = req.session.pageDefaults
		const breadcrumb = new Breadcrumb({
			Home: '/',
			Blog: '/posts',
			Post : null
		})
		const editButtons = post.author_id == currentUser.id ? `
			<div class="row mx-auto p-3">
				<button type="button" onclick="toggleForm()" class="editable-toggler btn bh-primary">Edit</button>
				<div class="btn-group">
					<button type="button" onclick="cancelForm()" class="editable-toggler btn bh-dark-grey" style="display:none;">Cancel</button>
					<button type="submit" class="editable-toggler btn bh-primary" style="display:none;">Save</button>
				</div>
			</div>` : ''
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Blog',
			body: `<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
				<div class="text-body container p-4">
					${breadcrumb.render()}
					<div class="text-center text-body container p-4">
						<div class="mx-auto col-lg-4 col-md-6 col-sm-11 col-xs-12">
							<form method="post" action="/posts/update">
								<input style="display:none;" name="id" value="${post.id}"></input>
								${postCard.render()}
								${editButtons}
							</form>
						</div>
					</div>
				</div>
		</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

module.exports = router
