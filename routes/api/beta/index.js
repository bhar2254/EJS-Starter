/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for /api/beta

	Roadmap

	- 	sendEmail for notifications routes
	-	routes for DOM generation
	-	general routes for generation
	-	routes for page generation (dataTables, forms, gallery)
*/	

//	variables necessary for express
const express = require('express')
const dotenv = require('dotenv').config()
const router = express.Router()

router.get('/status', 
	function(req, res, next){
		res.send({'status':200})
	}
)

/* GET users page. */
router.post('/update/:table/:guid',
	requiresAuth(),
	async function (req, res) {
		const { table, guid } = req.params
		let updateObject = { table: table, primaryKey: 'guid', guid: guid }
		updateObject = new SQLObject(updateObject)
		console.log({...req.body})
		await updateObject.update()
		return res.redirect(req.session.returnTo)
})
