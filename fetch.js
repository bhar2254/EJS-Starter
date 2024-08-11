/*	fetch.js

	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the MIT License.

	PURPOSE: Used for getting MS Graph information
*/	

const axios = require('axios')

/**
 * Attaches a given access token to a MS Graph API call
 * @param endpoint: REST API endpoint to call
 * @param accessToken: raw access token string
 */
async function fetch(endpoint, accessToken){
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    try {
        const response = await axios.get(endpoint, options)
        return await response.data
    } catch (error){
        return 'Error Fetching'
    }
}

module.exports = fetch;