/**
 * dom.js
 * Module for creating UI (Bootstrap 5) applications with Cloudflare Workers
 */

String.prototype.capitalizeFirstChar = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

class Defaults {
    static defaults = {}
    static setup = (setup) => {
        if (setup.defaults) {
            setDefts(setup.defaults)
        }
    }
    static setDefs = (setDefaults) => {
        for (const [key, value] of Object.entries(setDefaults)) {
            this.defaults[key] = value
        }
    }
}

class HtmlElement extends Defaults {
    constructor(args) {
        super(args)
        const _args = {...args}
        this.tag = _args.tag || ''
        this.attributes = _args.attributes || {}
        this.classes = _args.classes || []
        this.content = _args.content || ''
        this.parent = _args.parent || {}
        this.children = _args.children || []
    }
    set attributes(attr) {
        this._attributes = attr
    }
    get attributes() {
        let output = ''
        for (const [key, value] of Object.entries(this._attributes))
            output = ` ${key}='${value}'`
        return output
    }
    set children(children) {
        this._children = children
    }
    get children() {
        return this._children
    }
    set classes(classes) {
        this._classes = Array.isArray(classes) ? classes : []
    }
    get classes() {
        let response = ' '
        for (const each of this._classes)
            response += `${each} `
        return response.trim()
    }
    set content(content) {
        this._content = content
    }
    get content() {
        return this._content
    }
    set parent(parent) {
        this._parent = parent
    }
    get parent() {
        return this._parent
    }
    set tag(tag) {
        const htmlTags = ['!--...--', '!DOCTYPE', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'search', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']
        this._tag = htmlTags.includes(tag) ? tag : 'div'
    }
    get tag() {
        return this._tag
    }
    addChild(child) {
        if (!this._children.includes(child))
            this._children.push(child)
    }
    addClass(classString) {
        this._classes.push(classString)
        return this.classes
    }
    renderChildren() {
        let output = ''
        for (const each of this.children)
            output += ` ${each.render()} `
        return output
    }
    render() {
        return `<${this.tag}${this.attributes} class='${this.classes}'>${this.content}</${this.tag}>`
    }
}

class Button extends HtmlElement {
    constructor(args){
        super(args)
        this.classes = ['btn','bh-primary']
        this.tag = args.tag || 'button'
    }
}

class Breadcrumb extends HtmlElement { 
    constructor(args) { 
        super(args)
        this.classes = ['row']
        const _links = args || {}
        const links = []
        Object.keys(_links).forEach( each => {
            const value = _links[each] == null || typeof _links[each] === 'undefined' ? 
                `<li class="breadcrumb-item active" aria-current="page">${each}</li>` : 
                `<li class="breadcrumb-item" aria-current="page"><a href="${_links[each]}">${each}</a></li>`
            links.push(value)
        })
		this.content = `<div class="col">
					<nav aria-label="breadcrumb" class="bg-body-tertiary rounded-3 p-3 shadow-lg">
						<ol class="breadcrumb mb-0">
							${links.join('')}
						</ol>
					</nav>
				</div>`
    }
}

class Card extends HtmlElement {
    constructor(args) {
        super(args)
        this.addClass('card')
        const { header = '', body = '', footer = '', options = '' } = args
        this.header = header
        this.centered = options.centered ? 'text-center' : ''
        this.body = body
        this.footer = footer
        this.content = `
            <div class='card-header ${this.centered}'>
                ${this.header}
            </div>
            <div class="card-body">
                ${this.body}
            </div>          
            <div class="card-footer">
                <div class="row ${this.centered}">
                    ${this.footer}
                </div>
            </div>`
    }
    set header(header) {
        this._header = String(header)
    }
    get header() {
        return this._header
    }
    set body(body) {
        this._body = String(body)
    }
    get body() {
        return this._body
    }
    set footer(footer) {
        this._footer = String(footer)
    }
    get footer() {
        return this._footer
    }
}

// FormInput({[tag, type, label, pattern, options, value, width, placeholder]})
class FormInput extends HtmlElement {
    static inputGroup = (inputArr) => {

    }
    constructor(args) {
        super(args)
        this.key = args.key || ''
        this.id = args.id || this.key
        this.tag = args.tag || 'input'
        this.type = args.type || 'text'
        this.label = args.label || 'Field'
        this.pattern = args.pattern || ''
        this.options = args.options || []
        this.value = args.value || ''
        this.width = args.width || 'md'
        this.placeholder = args.placeholder || ''
    }
    set key(key) {
        this._key = key
    }
    get key() {
        return this._key
    }
    set label(label) {
        this.formattedLabel = label.trim().capitalizeFirstChar()
        this._label = label
    }
    get label() {
        return this._label
    }
    set tag(tag) {
        const typeList = ['select', 'input', 'textarea']
        const reformattedType = tag.trim().toLowerCase()
        this._tag = typeList.includes(reformattedType) ? tag : 'input'
    }
    get tag() {
        return this._tag
    }
    set type(type) {
        this._type = type
    }
    get type() {
        return this._type
    }
    set width(width) {
        const widths = {
            'xs': 'col-sm-2 col-xs-11',
            'sm': 'col-sm-4 col-xs-11',
            'md': 'col-sm-5 col-xs-11',
            'lg': 'col-11',
        }
        this._width = widths[width] || width || ''

    }
    get width() {
        return this._width
    }
    fieldWrapper(args) {
        const _args = { ...args }
        const id = _args.id || 'page_form'
        const content = _args.content || ''
        return `
            <div id='${id}' class='mb-3 mx-auto mb-3 mx-auto ${this.width}'>
                ${content}
            </div>`
    }
    render() {
        const fieldTypes = {
            'select': () => {
                let content = `
                    <label class='border-0' id='${this.key}_label'>${this.label}</label>
                    <select id='${this.key}_field' name='${this.key}' class='form-control border' style='cursor:auto;box-sizing:border-box;height:40.5px' type='select'>`
                if (!Array.isArray(this.options))
                    Object.entries(this.options).forEach(([key, value]) => {
                        const isActive = key == this.value || value == this.value ? ' selected' : ''
                        content += `
                            <option value='${key}'${isActive}>${value}</option>`
                    })
                if (Array.isArray(this.options))
                    this.options.forEach((each) => {
                        const isActive = each == this.value || each == this.value ? ' selected' : ''
                        content += `
                            <option value='${each}'${isActive}>${each}</option>`
                    })
                content += `
                    </select>`
                return this.fieldWrapper({ id: this.key, content: content })
            },
            'textarea': () => {
                const { id, key, value, label, placeholder = '' } = this
                let content = `
                    <label class='border-0' id='${id}_label'>${label}</label>
                    <textarea style='min-height:7.55rem;' rows='4' id='${id}_field' name='${key}' class='form-control border' placeholder='${placeholder}'>
                        ${value}
                    </textarea>`
                return this.fieldWrapper({ id: id, content: content })
            },
            'input': () => {
                const { id, key, value = '', label, type, placeholder = '', pattern = 0 } = this
                const fullPattern = pattern ? ` pattern=${pattern}` : ``
                let content = `
                    <label class='border-0' id='${id}_label'>${label}</label>
                    <input id='${id}_field' name='${key}' class='form-control border' style='cursor:auto;box-sizing:border-box;height:40.5px' type='${type}' placeholder='${placeholder}' ${fullPattern}'>
                    <script>
                        document.getElementById("${id}_field").value = "${value}";
                    </script>`
                return this.fieldWrapper({ id: id, content: content })
            }
        }
        return fieldTypes[this.tag]()
    }
}

// Form({id, fields, method, action})
class Form extends HtmlElement {
    constructor(args) {
        super(args)
        this._args = { ...args }
        this.id = this._args.id || 'page_form'
        this.form_html = ''
        this.hideSubmit = this._args.hideSubmit || false
        this.field_length = this._args.fields ? this._args.fields.length : 0
        this.method = this._args.method || 'GET'
        this.action = this._args.action || ''
        this.fields = this._args.fields || []
        this.columns = this._args.columns || 2
        delete this._args
    }
    addField = field => {
        return this.fields.push(field)
    }
    render() {
        let form_html = `    
            <form id='${this.id}' class='mx-auto col-lg-9 col-md-11 col-sm-12' action='${this.action}' method='${this.method}'>
                <div class='row'>`
        const additional_fields = {
            'hr': (x) => {
                return `${x.value}<hr>`
            },
            'br': (x) => {
                return `${x.value}<br>`
            }
        }
        for (const each of this.fields) {
            if (Object.keys(additional_fields).includes(each.key)) {
                form_html += additional_fields[each.key](each)
                continue
            }
            const formInput = new FormInput(each)
            form_html += formInput.render()
        }
        const submit = !this.hideSubmit ? `<button form="${this.id}" type="submit" class="btn bh-primary">Submit</button>`: ''
        return this.form_html = form_html + `
                    ${submit}
                </div>
            </form>`
    }
}

//     Modal({ id, title, body, footer, [trigger { style, text }]})
class Modal extends HtmlElement {
    static standardButtons = {
        'close': (args) => {
            return `<button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button>`
        },
        'save': (args) => {
            return `<button type='button' class='btn bh-primary'>Save</button>`
        },
        'submit': (args) => {
            return `<button type='submit' form='${args.form}' class='btn bh-primary'>Submit</button>`
        },
    }
    constructor(args) {
        super(args)
        this.id = args.id
        this.title = args.title
        this.body = args.body
        if(args.buttons)
            this.buttons = args.buttons.map(x => Modal.standardButtons[x.type](x.args || null)).join(' ')
        this.footer = args.footer || this.buttons || `${Modal.standardButtons.close()} ${Modal.standardButtons.save()}`

        this.trigger = {
            style: args.trigger ? args.trigger.style : 'primary',
            text: args.trigger ? args.trigger.text : 'Trigger Modal'
        }
    }
    set title(title) {
        this._title = title.trim().capitalizeFirstChar()
    }
    get title() {
        return this._title
    }
    set body(body) {
        this._body = body.trim().capitalizeFirstChar()
    }
    get body() {
        return this._body
    }
    set footer(footer) {
        this._footer = footer
    }
    get footer() {
        return this._footer
    }
    set trigger(trigger) {
        this._trigger = trigger
    }
    get trigger() {
        return `<button type='button' class='btn bh-${this._trigger.style}' data-bs-toggle='modal' data-bs-target='#${this.id}'>
            ${this._trigger.text}
        </button>`
    }
    render() {
        return `<div id='${this.id}' class='modal' tabindex='-1'>
            <div class='modal-dialog'>
                <div class='modal-content'>
                    <div class='modal-header'>
                        <h5 class='modal-title'>${this.title}</h5>
                        <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div class='modal-body'>
                        <p>${this.body}</p>
                    </div>
                    <div class='modal-footer'>
                        ${this.footer}
                    </div>
                </div>
            </div>
        </div>
        `
    }
}

class Parallax extends HtmlElement {
    constructor(args) {
        super(args)
        const _args = {...args}
        this.classes = ['parallax-canvas']
        this.height = _args.height || '15'
        this.link = _args.link || `${process.env.URI}/favicon.png`
    }
    set content(content) {
        this._content = content
    }
    get content() {
        return `<div class="parallax" style="position: relative;opacity: 0.75;background-attachment: fixed;background-position: center;background-repeat: no-repeat;background-size: cover; min-height: ${this.height}vh; background-image: url('${this.link}');"></div>`
    }
    render(args) {
        const _args = {...args}
        if(_args.link)
            this.link = _args.link
        if(_args.height)
            this.height = _args.height

        return `<${this.tag}${this.attributes} class='${this.classes}'>${this.content}</${this.tag}>`
    }
}

class Table extends HtmlElement {
    constructor(args) {
        super(args)
        this.tag = 'table'
        this.classes = ['table', 'table-striped', 'table-compact']
        const { data = [{}] } = args
        const content = []
        const includesHeader = args.includesHeader || false
        const header = []
        if (includesHeader) {
            Object.values(data[0]).forEach(row => {
                header.push(row)
            })
        } else {
            Object.keys(data[0]).forEach(row => {
                header.push(row)
            })
        }
        content.push('<tr>')
        header.forEach(key => {
            content.push(`
                <th>${key.replace('_', ' ').replace('-', ' ').split().map(x => x.capitalizeFirstChar())}</td>
            `)
        })
        content.push('</tr>')
        data.forEach(row => {
            content.push('<tr>')
            header.forEach(key => {
                content.push(`
                    <td>${row[key]}</td>
                `)
            })
            content.push('</tr>')
        })
        this.content = content.join('')
    }
}

class Page extends Defaults {
    static defaults = {
        siteTitle: 'Default',
        pageTitle: 'Page',
        brand: 'BlaineHarper.com',
        navbar: [{}],
        body: 'Bootstrap 5 Starter',
        header: '',
        footer: '',
    }
    constructor(args) {
        super(args)
        this.siteTitle = args.siteTitle ? args.siteTitle.capitalizeFirstChar() : Page.defaults.siteTitle
        this.pageTitle = args.pageTitle ? args.pageTitle.capitalizeFirstChar() : Page.defaults.pageTitle
        this.style = args.style || ''
        const header = args.header || {}
        this.header = {
            title: `${this.siteTitle} | ${this.pageTitle}`,
            overwrite: header.overwrite || false,
            append: header.append || '',
            block: header.block || false,
            dark: header.dark || false
        }
        this.brand = args.brand || args.siteTitle || Page.defaults.brand
        this.navbar = args.navbar || Page.defaults.navbar
        this.body = args.body || Page.defaults.body
        this.footer = args.footer || Page.defaults.footer
        this.tag = 'html'
    }
    set body(content) {
    //  <div class='m-5 mx-auto bg-glass bg-gradient shadow-lg bh-left-bar-secondary col-lg-9 col-md-12 col-sm-12'>'
        const body = `
    <body>
        <div class='main'>
            ${content}
        </div>`
        this.content = body
    }
    get body() {
        return this.content
    }
    set footer(content) {
        this._footer = content
    }
    get footer() {
        return `${this._footer}
    </body>
</html>`
    }
    set header(args) {
        this._header = { ...args }
    }
    get header() {
        return this._header.block || this._header.overwrite ? 
            this._header.overwrite || '' : 
            `<!DOCTYPE html>
<html lang="en" data-bs-theme="${this.dark ? 'light' : 'dark'}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${this._header.title}">
        <title>${this._header.title}</title>
	    <link rel="icon" type="image/x-icon" href="/favicon.png">
        ${this._header.append}
    </head>`
    }
    set navbar(navbar) {
        this._navbar = navbar
    }
    get navbar() {
        const generateDropdown = (args) => {
            const _args = { ...args }
            const text = _args.text || ''
            const links = _args.links || []

            let responseHtml = `
                <li class='nav-item dropdown'>
                    <a id='navbar_dropdown_item' class='nav-link' href='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'>${text}</a>
                        <ul class='dropdown-menu border shadow-lg'>`
            for (const each of links)
                if (each.text == 'hr')
                    responseHtml += `<hr style='color:#533; margin:0; padding:0;'>`
                else
                    responseHtml += `<li><a class='dropdown-item' target='${each.target || '_self'}' href='${each.link || '#'}'>${each.text || ''}</a></li>`
            return responseHtml + `</ul>
        </li>`
        }
        const dropdowns = this._navbar || [{}]
        let dropDownHtml = ''
        for (const each of dropdowns) {
            const link = each.link || false
            dropDownHtml += link ?
                `<li class='nav-item'>
                    <a id='navbar_item' class='nav-link' href='${link}' role='button'>${each.text}</a>` :
                generateDropdown(each)
        }
        return `
            <nav class='navbar navbar-expand-lg text-end bg-glass sticky-top shadow-lg'>
                <div class='col-10 container-fluid'>
                <button class='ms-auto bg-glass my-1 navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><i class='fa-solid fa-bars'></i></button>
                <div class='collapse navbar-collapse' id='navbarSupportedContent'>
                    <a id='navbar_banner_button' class='fs-5 navbar-brand hide-on-shrink' href='/'>${this.brand}</a>
                    <ul class='navbar-nav ms-auto'>
                        ${dropDownHtml}
                    </ul>
                </div>
                </div>
            </nav>`
    }
    set style(style) {
        this._style = style
    }
    get style() {
        return this._style
    }
    render() {
        return this.header + this.navbar + this.body + this.footer
    }
}

module.exports = {
    Defaults: Defaults,
    HtmlElement: HtmlElement,
    Breadcrumb: Breadcrumb,
    Card: Card,
    FormInput: FormInput,
    Form: Form,
    Modal: Modal,
    Parallax: Parallax,
    Table: Table,
    Page: Page,
}