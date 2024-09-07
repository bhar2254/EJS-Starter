/*	app.js
	EJS-Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper
*/	

//	required packages
const express = require('express')
const session = require('express-session')
const { auth } = require('express-openid-connect')
const path = require('path')
const cors = require('cors')
const logger = require('morgan')
const cluster = require('cluster')
const process = require('node:process')
const cookieParser = require('cookie-parser')
const { Page } = require('./routes/util/DOM')
const { SQLObject, queryPromise } = require('./routes/util/sql')
const { consoleColors } = require('./routes/util/harper')
const { applyCSSTheme } = require('./routes/util/themes')
const { downloadImage } = require('./routes/util/cacheImages')
require('dotenv').config()

String.prototype.capitalizeFirstChar = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

//	setting local env vars
const DEBUG = process.env.DEBUG || false
const PORT = process.env.PORT || 3000
const APP_DISABLED = false
const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.EXPRESS_SESSION_SECRET,
	baseURL: `${process.env.URI}`,
	clientID: process.env.CLIENT_ID,
	issuerBaseURL: process.env.ISSUER_URL
}

//	start app
var app = express()

// auth router attaches /login, /logout, and /callback routes to the baseURL

app.use(auth(config))

//	view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//	express environment setup
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors(
	{credentials: true},
))

//	using express-session middleware for persistent user session. Be sure to
//	familiarize yourself with available options. Visit: https://www.npmjs.com/package/express-session
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))

const headerLinks = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css"/>
<link rel="stylesheet" href="https://bhar2254.github.io//src/css/ejs-starter/bs.add.css"/>
<link href="https://cdn.datatables.net/v/bs5/jszip-3.10.1/dt-1.13.6/b-2.4.1/b-colvis-2.4.1/b-html5-2.4.1/cr-1.7.0/r-2.5.0/rr-1.4.1/sc-2.2.0/sb-1.5.0/sp-2.2.0/sl-1.7.0/datatables.min.css" rel="stylesheet">

<link rel="icon" type="image/x-icon" href="https://blaineharper.com/assets/favicon.ico">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>`


const footer = `</main>
	<footer id="mainFooter" class="shadow-lg p-2 text-center bg-glass mx-auto sticky-footer">
		<span id="footerText">2024 © BlaineHarper.com</span>
	</footer>
	<button class='btn rounded-circle'onclick="topFunction()" id="topButton" title="Go to top">Top</button>
	
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
	<script src="https://code.jquery.com/jquery-3.7.0.js" crossorigin="anonymous"></script>
	<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js" crossorigin="anonymous"></script>
	<script src="/js/jQuery.dirty.js"></script>
	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
	<script src="https://cdn.datatables.net/v/bs5/jszip-3.10.1/dt-1.13.6/b-2.4.1/b-colvis-2.4.1/b-html5-2.4.1/cr-1.7.0/r-2.5.0/rr-1.4.1/sc-2.2.0/sb-1.5.0/sp-2.2.0/sl-1.7.0/datatables.min.js"></script>

	<script src="https://kit.fontawesome.com/5496aaa581.js" crossorigin="anonymous"></script>
	<script src="${process.env.URI}/js/formToggler.js"></script>
	<script>
		// Get the button
		let buttonToTop = document.getElementById("topButton")

		// When the user scrolls down 20px from the top of the document, show the button
		window.onscroll = function(){scrollFunction()}

		function scrollFunction(){
			if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20){
				buttonToTop.style.display = "block"
			} else {
				buttonToTop.style.display = "none"
			}
		}

		// When the user clicks on the button, scroll to the top of the document
		function topFunction(){
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0
		}
	</script>
	<script>
		$(document).ready(function() {
			$('form').each(function() {
				$(this).dirty({
					preventLeaving: true
				});
			});
		});
	</script>
</body>
</html>`

let pageDefaults = {
	header: {
		dark: true,
		append: `${headerLinks}
		${applyCSSTheme('003B6F')}
		<style>
		body {
			background-repeat: no-repeat;
			background-attachment: fixed;

			/* Full height */
			height: 100%;

			/* Center and scale the image nicely */
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;

			background-image: url('https://apod.nasa.gov/apod/image/2408/AuroraPerseids_Anders_1080.jpg');
			font-family: 'Gotham Narrow', sans-serif;
		}
		</style>`
	},
	siteTitle: `EJS Starter`,
	brand: `BlaineHarper.com`,
	footer: footer
}

//  check if user has logged in before
const checkForAccount = async (oidc) => {
	const user = new SQLObject({ 
		table: 'users', 
		email: oidc.user.email, 
		primaryKey: 'email', 
		...oidc.user 
	})
	const data = await user.read()
	if(data == 0 || data.length == 0) {
		await user.create()
	}
	const response = await user.read()
	return response[0]
}

const examplePages = {
	'parallax': 'Parallax',
	'typography': 'Typography'
}

app.use(
	async function(req, res, next) {
	if(typeof req.session.meta == 'undefined'){
		const meta = new SQLObject({table: 'meta', all: true})
		const data = await meta.read()
		let metaObj = {}
		data.map(x => metaObj[x.ref] = JSON.parse(x.value))
		req.session.meta = metaObj
	}

	pageDefaults.navbar = [{
		text: 'About',
		links: [{
			text: 'Developer',
			link: '/about/developer'
		},{
			text: 'Other Projects',
			link: '/about/projects'
		}],
	},{
		text: 'Examples',
		links: Object.keys(examplePages).map(x => { 
			return { text: examplePages[x], link: `/examples/${x}` }
		}),
	},{
		text: 'Posts',
		link: '/posts',
	}]
	const isAuth = req.oidc.isAuthenticated()
	if(isAuth){
		if(!req.session.currentUser)
			req.session.currentUser = await checkForAccount(req.oidc)

		const currentUser = req.session.currentUser
		const { min_admin } = req.session.meta
		const { DB_DB } = process.env

		downloadImage(currentUser.picture, `./public/imgs/profiles`, currentUser.guid)

		const isAdmin = currentUser.isAdmin = min_admin <= currentUser.role
		const tables = await queryPromise('SHOW TABLES;')
		const tableList = tables.map(x => ({
			text: String(x[`Tables_in_${DB_DB}`]).capitalizeFirstChar(), 
			link: `/view/${x[`Tables_in_${DB_DB}`]}`
		}))
		if(isAdmin) {
			pageDefaults.navbar = pageDefaults.navbar.concat([{
				text: 'Admin',
				links: [{
					text: 'Admin Center',
					link: '/admin'
				}, ...tableList]
			}])
		}

		pageDefaults.navbar = pageDefaults.navbar.concat([{
			text: `<img src="/imgs/profiles/${currentUser.guid || ''}.webp" alt="avatar" class="rounded-circle img-fluid" style="width: 1.5rem;">`,
			link: '/users/profile/me'
		},{
			text: 'My Profile',
			link: '/users/profile/me'
		},{
			text: 'Logout',
			link: '/signout'
		}])
	}
	if(!isAuth){
		pageDefaults.navbar.push({
			text: 'Log In',
			link: '/login'
		})	
	}
	req.session.pageDefaults = pageDefaults
	next()
})

const minAdmin = (req, res, next) => {
	if(req.session.meta.min_admin > req.session.currentUser.role)
		return res.redirect('/users/profile/me')
	return next()
}

//	set an endpoint for the root directory and main page routing
if(!APP_DISABLED){
	// app.use(loadSQLEnvironment)
	app.use(`/`,require(`./routes/index`))
	app.use(`/users`,require(`./routes/users`))
	app.use(`/examples`,require(`./routes/examples`))
	app.use(`/posts`,require(`./routes/posts`))
	app.use(`/about`,require(`./routes/about`))
	app.use(minAdmin)
	app.use(`/admin`,require(`./routes/admin`))
}

if(APP_DISABLED)
	app.use(`*`,require(`./routes/app_disabled`))

// catch 404 and forward to error handler
app.use(function(req, res, next){
	const page = new Page({
		...req.session.pageDefaults,
		pageTitle: '404 Not Found',
		body: '<div class="text-center py-3 my-5"><strong>404</strong> Page not found!</div>'	
	})
	res.render('pages/blank', { content: page.render() })
})

// error handler
app.use(function(err, req, res, next){
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('base/error')
})

//	app.js relaunch
if (cluster.isPrimary){
//	fork the app worker
	console.log(`${consoleColors.Bright}(${process.pid}) is running on port ${PORT}${consoleColors.Reset}`)
	if(DEBUG){console.log(`${consoleColors.Dim}${process.pid}: Debugging is active${consoleColors.Reset}`)}
	worker = cluster.fork()

//	fork on exit to restart application
	cluster.on('exit', function(worker, code, signal){
		cluster.fork()
	})
} else {
//	start the app listening on port from .env
	app.listen(PORT)
}

module.exports = app
