/*	env.js

	EJS Starter, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Environment setup for app.js
		This script is included at the beginning of every .js file
		Used for general purpose variables and objects
		General purpose functions should be included in the /util/harper module
*/

//	variables for application environment
min_admin = 2
datetime_format = '%Y-%m-%dT%H:%i'
date_format = '%Y-%m-%d'
date_formats = {
	date: date_format,
	datetime: datetime_format,
}

//	Colors for beautifying the console
consoleColors = {
//	Node colors for reference
	Reset: "\x1b[0m",
	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",
//	Forground
	FgBlack: "\x1b[30m",
	FgRed: "\x1b[31m",
	FgGreen: "\x1b[32m",
	FgYellow: "\x1b[33m",
	FgBlue: "\x1b[34m",
	FgMagenta: "\x1b[35m",
	FgCyan: "\x1b[36m",
	FgWhite: "\x1b[37m",
	FgGray: "\x1b[90m",
//	Background
	BgBlack: "\x1b[40m",
	BgRed: "\x1b[41m",
	BgGreen: "\x1b[42m",
	BgYellow: "\x1b[43m",
	BgBlue: "\x1b[44m",
	BgMagenta: "\x1b[45m",
	BgCyan: "\x1b[46m",
	BgWhite: "\x1b[47m",
	BgGray: "\x1b[100m"
}

ENV = {}