/*	accounts
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Useful functions and variables used throughout the application
*/

const crypto = require('crypto')

//	check if user is authenticated and redirect them to the login route
const isAuthenticated = (req, res, next) => {
	if(!req.oidc.isAuthenticated())
		return res.redirect('/login')	//	needs login route from auth0
	next()
}

//	generate UUID placeholder for SSO guid
const uuidv0 = '00000000-0000-0000-0000-000000000000'
const uuidv4 = () => {
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}

class User extends SQLObject {
	constructor(args) {
		super(args)
	}
	get isAdmin() {
		if (!this.role)
			return this._admin = false
		if (this.role <= 2)
			return this._admin = false
		return this._admin = true
	}
}

// 	Export functions for later use
module.exports = {
	isAuthenticated: isAuthenticated,
	uuidv0: uuidv0,
	uuidv4: uuidv4,
	User: User
}