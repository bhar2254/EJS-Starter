/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for express server
*/

//	variables necessary for express
const { Page, Parallax, Breadcrumb } = require('./util/DOM')
const fetch = require('../fetch')
const express = require('express')
const router = express.Router()

//
//	Redirects and Misc Endpoints
//

/* GET home page. */
router.get('/',
	async function (req, res, next) {
		const pageDefaults = req.session.pageDefaults
        const breadcrumb = new Breadcrumb({
            links: {
                'Home': '/',
                'Examples': null,
            }
        })
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Home',
			body: `<div class="text-body container p-5">
			${breadcrumb.render()}
			<div class="container p-5">
                <div class="row">
                    <div class="text-body text-center">
				        Welcome to my newest version of my ExpressJS Starter site! Here you can browse some templates that I've made!
                    </div>
                </div>
                <div class="row mt-5">
                    <ul class="list-group text-center">
                        <li class="list-group-item""><a href="/examples/parallax">Parallax</a></li>
                    </ul>
                </div>
			</div>
		</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

/* GET home page. */
router.get('/parallax',
	async function (req, res, next) {
        const breadcrumb = new Breadcrumb({
            links: {
                'Home': '/',
                'Examples': '/examples',
                'Parallax Demo': null,
            }
        })
		const apod = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
		const pageDefaults = req.session.pageDefaults
		const parallax = new Parallax()
        const parallaxGroup = (args) => {
            const _args = {...args}
            const title = `<div class="col-sm-4 col-xs-12">
                        <h1>${_args.title}</h1>
                    </div>`
            return `<div class="text-center text-body container p-5">
				<div class="row">
                    ${!_args.flipped ? title : ''}
                    <div class="col-sm-8 col-xs-12">
				        <p>${_args.explanation}</p>
                    </div>
                    ${_args.flipped ? title : ''}
                </div>
			</div>
			${parallax.render({height: _args.height || null, link: _args.url || null})}`
        }
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Parallax',
			body: `
                <div class="m-5 mx-auto bh-dark-grey bh-left-bar-secondary bg-gradient col-lg-9 col-md-12 col-sm-12 text-body">
                    <div class="p-5">
                        ${breadcrumb.render()}
                    </div>
                    ${parallax.render({height: 25, link: `https://api.nasa.gov/EPIC/archive/natural/2019/05/30/png/epic_1b_20190530011359.png?api_key=${process.env.NASA_API_KEY}`})}
                    <div class="text-center mt-5">
                        <h1>Astronomy Picture of the Day</h1>
                    </div>
                    ${parallaxGroup({height: 50, ...apod})}
                    ${parallaxGroup({flipped: true, height: 25 , title: 'Webb Captures the Cartwheel Galaxy', 
                        explanation: `NASA’s James Webb Space Telescope has peered into the chaos of the Cartwheel Galaxy, revealing new details about star formation and the galaxy’s central black hole. Webb’s powerful infrared gaze produced this detailed image of the Cartwheel and two smaller companion galaxies against a backdrop of many other galaxies. This image provides a new view of how the Cartwheel Galaxy has changed over billions of years.`,
                        url: `https://science.nasa.gov/wp-content/uploads/2023/09/stsci-01g8jzq6gwxhex15pyy60wdrsk-2.png?w=2048&format=webp` 
                    })}
                    ${parallaxGroup({title: 'Revealing the Milky Way’s Center', 
                        explanation: `The center of our Milky Way galaxy is hidden from the prying eyes of optical telescopes by clouds of obscuring dust and gas. But in this stunning vista, NASA's Spitzer Space Telescope's infrared cameras penetrate much of the dust, revealing the stars of the crowded galactic center region.`,
                        url: `https://science.nasa.gov/wp-content/uploads/2023/09/ssc2006-02a-0.jpg?w=2048&format=webp` 
                    })}
                    ${parallaxGroup({flipped: true, title: 'Centaurus A', 
                        explanation: `NASA's Stratospheric Observatory for Infrared Astronomy (SOFIA) observed magnetic fields showin in this composite image of Centaurus A. They're shown as streamlines over an image of the galaxy taken at visible and submillimeter wavelengths by the European Southern Observatory and Atacama Pathfinder Experiment (orange), X-ray wavelengths from NASA's Chandra X-Ray observatory (blue) and infrared from NASA's Spitzer Space Telescope (dark red).`,
                        url: `https://science.nasa.gov/wp-content/uploads/2023/09/cena-lic-lp-nature-cropped.jpg?w=2048&format=webp` 
                    })}
                </div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

module.exports = router
