/*	index.js
	EJS Starter Site, https://ejs-starter.blaineharper.com
	by Blaine Harper

	PURPOSE: Root router for express server
*/

//	variables necessary for express
const { Page, Parallax, Breadcrumb } = require('./util/DOM')
const { cacheFetch } = require('./util/harper')
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
            'Home': '/',
            'Examples': null,
        })
        const pages = {
            'parallax': 'Parallax',
            'typography': 'Typography'
        }
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Examples',
			body: `
                <div class="m-5 mx-auto bh-dark-grey bh-left-bar-secondary bg-gradient col-lg-9 col-md-12 col-sm-12 text-body">
                    <div class="p-4">
			${breadcrumb.render()}
                <div class="container p-4">
                    <div class="row">
                        <div class="text-body text-center">
                            Welcome to my newest version of my ExpressJS Starter site! Here you can browse some templates that I've made!
                        </div>
                    </div>
                    <div class="row mt-5">
                        <div class="mx-auto col-lg-4 col-md-6 col-sm-11 col-xs-12">
                            <ul class="list-group text-center">
                                ${Object.keys(pages).map(x => `<li class="list-group-item""><a href="/examples/${x}">${pages[x]}</a></li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

/* GET home page. */
router.get('/typography',
	async function (req, res, next) {
		const pageDefaults = req.session.pageDefaults
        const breadcrumb = new Breadcrumb({
            'Home': '/',
            'Examples': '/examples',
            'Typography': null,
        })
		const page = new Page({
			...pageDefaults,
			pageTitle: 'Typography',
			body: `
                <div class="m-5 mx-auto bh-dark-grey bh-left-bar-secondary bg-gradient col-lg-9 col-md-12 col-sm-12 text-body">
                    <div class="p-4">
			${breadcrumb.render()}
			<div class="container p-4">
                <div cass="row">
                    <p class="lead text-center">From the official Bootstrap cheatsheet found at <a href="https://getbootstrap.com/docs/5.0/examples/cheatsheet/">getbootstrap.com</a></p>
                </div>
                <div class="row">
                    <div>
        <div class="bd-example">
        <p class="display-1">Display 1</p>
        <p class="display-2">Display 2</p>
        <p class="display-3">Display 3</p>
        <p class="display-4">Display 4</p>
        <p class="display-5">Display 5</p>
        <p class="display-6">Display 6</p>
        </div>

        <div class="bd-example">
        <p class="h1">Heading 1</p>
        <p class="h2">Heading 2</p>
        <p class="h3">Heading 3</p>
        <p class="h4">Heading 4</p>
        <p class="h5">Heading 5</p>
        <p class="h6">Heading 6</p>
        </div>

        <div class="bd-example">
        <p class="lead">
          This is a lead paragraph. It stands out from regular paragraphs.
        </p>
        </div>

        <div class="bd-example">
        <p>You can use the mark tag to <mark>highlight</mark> text.</p>
        <p><del>This line of text is meant to be treated as deleted text.</del></p>
        <p><s>This line of text is meant to be treated as no longer accurate.</s></p>
        <p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>
        <p><u>This line of text will render as underlined.</u></p>
        <p><small>This line of text is meant to be treated as fine print.</small></p>
        <p><strong>This line rendered as bold text.</strong></p>
        <p><em>This line rendered as italicized text.</em></p>
        </div>

        <div class="bd-example">
        <blockquote class="blockquote">
          <p>A well-known quote, contained in a blockquote element.</p>
          <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
        </blockquote>
        </div>

        <div class="bd-example">
        <ul class="list-unstyled">
          <li>This is a list.</li>
          <li>It appears completely unstyled.</li>
          <li>Structurally, it's still a list.</li>
          <li>However, this style only applies to immediate child elements.</li>
          <li>Nested lists:
            <ul>
              <li>are unaffected by this style</li>
              <li>will still show a bullet</li>
              <li>and have appropriate left margin</li>
            </ul>
          </li>
          <li>This may still come in handy in some situations.</li>
        </ul>
        </div>

        <div class="bd-example">
        <ul class="list-inline">
          <li class="list-inline-item">This is a list item.</li>
          <li class="list-inline-item">And another one.</li>
          <li class="list-inline-item">But they're displayed inline.</li>
        </ul>
        </div>
      </div>
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
            'Home': '/',
            'Examples': '/examples',
            'Parallax': null,
        })
		const apod = await cacheFetch('nasa_apod',`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
		const pageDefaults = req.session.pageDefaults
		const parallax = new Parallax()
        const parallaxGroup = (args) => {
            const _args = {...args}
            const title = `<div class="col-sm-4 col-xs-12">
                        <h1>${_args.title}</h1>
                    </div>`
            return `<div class="text-center text-body container p-4 my-5">
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
                    <div class="p-4">
                        ${breadcrumb.render()}
                    </div>
                    ${parallax.render({height: 75, link: `https://api.nasa.gov/EPIC/archive/natural/2019/05/30/png/epic_1b_20190530011359.png?api_key=${process.env.NASA_API_KEY}`})}
                    <div class="text-center mt-5">
                        <h1>Astronomy Picture of the Day</h1>
                    </div>
                    ${parallaxGroup({height: 100, ...apod})}
                    ${parallaxGroup({flipped: true, height: 50, title: 'Webb Captures the Cartwheel Galaxy', 
                        explanation: `NASA’s James Webb Space Telescope has peered into the chaos of the Cartwheel Galaxy, revealing new details about star formation and the galaxy’s central black hole. Webb’s powerful infrared gaze produced this detailed image of the Cartwheel and two smaller companion galaxies against a backdrop of many other galaxies. This image provides a new view of how the Cartwheel Galaxy has changed over billions of years.`,
                        url: `https://science.nasa.gov/wp-content/uploads/2023/09/stsci-01g8jzq6gwxhex15pyy60wdrsk-2.png?w=2048&format=webp` 
                    })}
                    ${parallaxGroup({title: 'Revealing the Milky Way’s Center', 
                        explanation: `The center of our Milky Way galaxy is hidden from the prying eyes of optical telescopes by clouds of obscuring dust and gas. But in this stunning vista, NASA's Spitzer Space Telescope's infrared cameras penetrate much of the dust, revealing the stars of the crowded galactic center region.`,
                        url: `https://science.nasa.gov/wp-content/uploads/2023/09/ssc2006-02a-0.jpg?w=2048&format=webp` 
                    })}
                    ${parallaxGroup({height: 100, flipped: true, title: 'Centaurus A', 
                        explanation: `NASA's Stratospheric Observatory for Infrared Astronomy (SOFIA) observed magnetic fields showin in this composite image of Centaurus A. They're shown as streamlines over an image of the galaxy taken at visible and submillimeter wavelengths by the European Southern Observatory and Atacama Pathfinder Experiment (orange), X-ray wavelengths from NASA's Chandra X-Ray observatory (blue) and infrared from NASA's Spitzer Space Telescope (dark red).`,
                        url: `https://science.nasa.gov/wp-content/uploads/2023/09/cena-lic-lp-nature-cropped.jpg?w=2048&format=webp` 
                    })}
                </div>`
		})
		res.render('pages/blank', { content: page.render() })
	}
)

module.exports = router
