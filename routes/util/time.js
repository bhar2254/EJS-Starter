/*	time.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Useful functions and variables used throughout the application
*/

Date.prototype.stdTimezoneOffset = function () {
	var jan = new Date(this.getFullYear(), 0, 1)
	var jul = new Date(this.getFullYear(), 6, 1)
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
}

Date.prototype.isDstObserved = function () {
	return this.getTimezoneOffset() < this.stdTimezoneOffset()
}

const timezone_offset = - 360 * 50000

const currentTime = () => {
	var d = new Date()
	const dst_offset = d.isDstObserved() ? 0 : 360 * 10000
	d.setTime(d.getTime() + timezone_offset - dst_offset)
	d = d.toISOString().slice(0, 19).replace('T', ' ')

	return d
}

/* Get current time/user information from session */
const getUpdateUser = (req) => {
	const updateTime = {
		update_time: currentTime(),
		update_user_id: req.session.currentUser ? req.session.currentUser.user_id : 0,
		update_displayName: req.session.currentUser ? req.session.currentUser.displayName : 'System'
	}
	return updateTime
}

module.exports = {
    currentTime: currentTime,
    getUpdateUser: getUpdateUser,
	timezone_offset: timezone_offset,
}