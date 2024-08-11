<div id="markdown_document" class="p-5">  

<span class="mx-auto">
    
# EJS Starter  
  
[![](https://img.shields.io/badge/version-1.0.0-782F40?style=flat)](https://ejs-starter.blaineharper.com)
    
Express.js UI+API application for interacting with Ellucian Colleague vehicle registrations.   

## Live Site  
[![](https://img.shields.io/badge/Prod-1.0.0-003B6F?style=flat)](https://ejs-starter.blaineharper.com/readme)  
EJS Starter is a UI/API server to manage a MySQL database cloned to Ellucian Colleague's UniData database for record redundancy.  
  
This UI allos users to login via MS SSO, automatically building user accounts via Graph API. From there users can manage their registered vehicles, apply for a parking permit, or handle an unexpected citation.  
  
Administrators will maintain control over user profiles and resource modifications but can manage user access with a page by page or element by element approach.  
  
Facilitate user applications for parking passes, tracking application progress, applicable to any currently registered vehicle.    
  
Implement citation tracking for both user's and unidentified vehicles via plate, VIN, or parking pass.   
  
## Dependencies  
[![](https://img.shields.io/badge/js-Node-782F40?style=flat)](https://nodejs.org/en)
[![](https://img.shields.io/badge/js-Express-782F40?style=flat)](https://expressjs.com/)
[![](https://img.shields.io/badge/css-Bootstrap%205-003B6F?style=flat)](https://getbootstrap.com/)
   
  - `Express.js` for generating HTML pages from `.ejs` templates as well as serving JSON responses for API calls.   
  - `Bootstrap 5`, for styling    
  - Cloudflare (optional), for tunneling and domain administration  
  
## Installation
  
Download the Git repositories into the root directory of your web server.  

If you're clever, fill in the missing `.env` files that have been left untracked in this repo.  
   
   For the most part they're just a standard `.env` file for MS AD Authentication that you'll find accross the internet.
   
   If you prefer to have your riddles spoiled, there's a gist that contains a cleaned version of the .env file in this [public gist](https://gist.github.com/bhar2254/a6cb7064dda047124d685670a8ab893a).
  
  
Endpoint: http://localhost:3000/

</div>
