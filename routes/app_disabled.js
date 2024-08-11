/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for express server
*/	

//	variables necessary for express
const tools = require('./util/harper')
const { queryPromise, SQLTable, SQLTables, SQLObject } = require('./util/sql')
const {isAuthenticated} = require('./util/accounts')
const express = require('express')
const dotenv = require('dotenv')
const router = express.Router()

//
//	REDIRECTS AND MISC ENDPOINTS
//

/*	Render the GitHub README.md file for admin users to reference	*/
router.get('/readme',
	isAuthenticated,
	function(req, res, next){
	const path = __dirname +"/../README.md";
	const include = fs.readFileSync (path, 'utf8')
	const html = marked.parse(include)
		
//	render markdown
	res.render ('docs', {env: req.session.env, loc: req.session.loc, currentUser: req.session.currentUser,
			title:'Readme', subtitle:'', md: html
		})
})

/*	GET phpMyAdmin page. */
router.get('/phpMyAdmin', function(req, res, next){
	res.redirect("https://parkingapi.indianhills.edu/phpMyAdmin")
})

/*	GET / page. */
router.get('/', function(req, res, next){
	res.send({'response':"EJS Starter is currently down for maintenance. Sorry for the inconvenience. - Blaine"})
})

module.exports = router