/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for express server
*/

//	variables necessary for express
const { Page, Parallax } = require('./util/DOM')
const express = require('express')
const router = express.Router()

//
//	Redirects and Misc Endpoints
//

/* GET home page. */
router.get('/',
	async function (req, res, next) {
		const pageDefaults = req.session.pageDefaults
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Home',
			body: `<div class="text-body container py-5">
			<div class="row">
				<div class="col">
					<nav aria-label="breadcrumb" class="bg-body-tertiary rounded-3 p-3 mb-4">
						<ol class="breadcrumb mb-0">
							<li class="breadcrumb-item active" aria-current="page">Home</li>
						</ol>
					</nav>
				</div>
			</div>
			<div class="text-center text-body container py-5">
				Welcome to my newest version of my ExpressJS Starter site!
			</div>
		</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

/* GET home page. */
router.get('/parallax',
	async function (req, res, next) {
		const pageDefaults = req.session.pageDefaults
		const parallax = new Parallax({ link: "https://science.nasa.gov/wp-content/uploads/2023/09/web-first-images-release.png?w=2048&format=webp"})
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Parallax',
			body: `<div class="text-body container py-5">
			<div class="row">
				<div class="col">
					<nav aria-label="breadcrumb" class="bg-body-tertiary rounded-3 p-3 mb-4">
						<ol class="breadcrumb mb-0">
							<li class="breadcrumb-item" aria-current="page"><a href="/">Home</a></li>
							<li class="breadcrumb-item active" aria-current="page">Parallax Demo</li>
						</ol>
					</nav>
				</div>
			</div>
			<div class="text-center text-body container py-5">
				<h1>Webb Captures the Cartwheel Galaxy</h1>
				<p>NASA’s James Webb Space Telescope has peered into the chaos of the Cartwheel Galaxy, revealing new details about star formation and the galaxy’s central black hole. Webb’s powerful infrared gaze produced this detailed image of the Cartwheel and two smaller companion galaxies against a backdrop of many other galaxies. This image provides a new view of how the Cartwheel Galaxy has changed over billions of years.</p>
			</div>
			${parallax.render({ link: `https://science.nasa.gov/wp-content/uploads/2023/09/stsci-01g8jzq6gwxhex15pyy60wdrsk-2.png?w=2048&format=webp` })}
			<div class="text-center text-body container py-5">
				<h1>Revealing the Milky Way’s Center</h1>
				<p>The center of our Milky Way galaxy is hidden from the prying eyes of optical telescopes by clouds of obscuring dust and gas. But in this stunning vista, NASA's Spitzer Space Telescope's infrared cameras penetrate much of the dust, revealing the stars of the crowded galactic center region.</p>
			</div>
			${parallax.render({ link: `https://science.nasa.gov/wp-content/uploads/2023/09/ssc2006-02a-0.jpg?w=2048&format=webp` })}
			<div class="text-center text-body container py-5">
				<h1>Centaurus A</h1>
				<p>NASA's Stratospheric Observatory for Infrared Astronomy (SOFIA) observed magnetic fields showin in this composite image of Centaurus A. They're shown as streamlines over an image of the galaxy taken at visible and submillimeter wavelengths by the European Southern Observatory and Atacama Pathfinder Experiment (orange), X-ray wavelengths from NASA's Chandra X-Ray observatory (blue) and infrared from NASA's Spitzer Space Telescope (dark red).</p>
			</div>
			${parallax.render({ link: `https://science.nasa.gov/wp-content/uploads/2023/09/cena-lic-lp-nature-cropped.jpg?w=2048&format=webp` })}
			<div class="text-center text-body container py-5">
				Welcome to my newest version of my ExpressJS Starter site!
			</div>
		</div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

router.get('/status', function (req, res, next) {
	res.sendStatus(200)
})

module.exports = router
