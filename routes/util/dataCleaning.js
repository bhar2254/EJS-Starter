/*	dataCleaning.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Useful functions and variables used for building SQL queries throughout the application
*/

/* Get current time/user information from session */
const convertForMySQL = (datetime) => {
	var d=new Date(datetime)
	d.setTime(d.getTime() + timezone_offset)
	d=d.toISOString().slice(0, 19).replace('T', ' ')
	
	return d
}

/*	Function for removing data from scopes 	*/
const filterDropData = (data, arr=[]) => {
	local_data=data
	arr=['citation_count',
			'unres_citation',
			'vehicle_count',
			'create_time',
			'create_user_id',
			'create_displayName',
			'update_time',
			'update_user_id',
			'update_displayName'].concat(arr)
	for(i=0;i<arr.length;i++)
		delete local_data[arr[i]]
	return local_data
}

const capitalize = (string) => {
	if(typeof string !== 'string')
		return string
	
	const str = string
	//split the above string into an array of strings 
	//whenever a blank space is encountered

	const arr = str.split(" ")

	//loop through each element of the array and capitalize the first letter.

	for (var i = 0; i < arr.length; i++)
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)

	//Join all the elements of the array back into a string 
	//using a blankspace as a separator 
	const str2 = arr.join(" ")
	return str2
}

module.exports = {
    filterDropData: filterDropData,
    convertForMySQL: convertForMySQL,
    capitalize: capitalize
}