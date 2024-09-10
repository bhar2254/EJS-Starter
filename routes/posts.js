/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for express server
*/

//	variables necessary for express
const { Page, Breadcrumb, Card, Form, Modal } = require('./util/DOM')
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

router.post('/update',
	requiresAuth(),
	async function (req, res) {
		const post = req.body
		const postUpdate = new SQLObject({table: 'posts', id: post.id})
		await postUpdate.update({id: post.id, ...post})
		return res.redirect(req.session.returnTo)
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
				</div>`
		}).join(' ')
	// 	Form({id, fields, method, action})
		const newForm = new Form({
			id: 'new-post-form',
			hideSubmit: true,
			fields: [{
				key: 'title',
				type: 'text',
				label: `Title`,
				placeholder: 'Title',
				required: true,
			},{
				key: 'subtitle',
				type: 'text',
				label: `Subtitle`,
				placeholder: 'Subtitle',
				required: true,
			},{
				key: 'tags',
				type: 'text',
				label: `Tags`,
				placeholder: 'Tags',
			},{
				key: 'content',
				type: 'text',
				label: `Content`,
				placeholder: 'Content',
				required: true,
			},],
			method: 'post',
			action: '/create/posts'
		})
	//	Modal({ id, title, body, footer, [trigger { style, text }]})
		const newObject = new Modal({
			id: 'new-post',
			title: 'New Post', 
			body: newForm.render(),
			buttons: [{
				type: 'close'
			},{
				type: 'submit',
				args: { form: 'new-post-form'}
			},],
			trigger: { style: 'primary', text: 'New Post'}
		})
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Blog',
			body: `${newObject.render()}
					<div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>
						<div class="text-body container p-4">
							${breadcrumb.render()}
							<div class="text-center text-body container my-5">
								<div class="mx-auto col-lg-4 col-md-6 col-sm-11 col-xs-12 mb-5">
									<div class="row">
										Here you can browse a sample blog and see any new updates to the website or my projects!
									</div>
									<div class="row">
										<div class="col mt-3">
											${req.oidc.isAuthenticated() ? newObject.trigger : ''}
										</div>
									</div>
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
		const create_time = String(post.create_time) || ''
		const create_date = new Date(create_time)
		const time_string = `${create_time.substring(0,10)} @ ${create_date.toLocaleTimeString()}`
		const breadcrumbObj = {
			'Home': '/',
			'Blog': '/posts',
		}
		breadcrumbObj[post.title] = null
		const breadcrumb = new Breadcrumb(breadcrumbObj)
		const postCard = new Card({
			header: `<div>
						<h3><span id="title" class="editable">${post.title}</span></h3> <span id="subtitle" class="editable small text-muted">${post.subtitle}</span>
					</div>`,
			body: `<span id="content" class="editable marked-content" data-tag="textarea">${post.content}</span>`,
			footer: `<div class="text-center">by ${post.name == null ? 'Anonymous' : post.name} on ${time_string}</div>`,
		})
		const editButtons = req.session.currentUser && ( post.author_id == currentUser.id || currentUser.isAdmin ) ? `
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
			<div class="text-body container p-4">
				<div class="mx-auto col-lg-7 col-md-9 col-sm-11 col-xs-12">
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

module.exports = router
