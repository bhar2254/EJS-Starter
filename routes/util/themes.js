
const applyCSSTheme = (scheme) => {
	const hexToRBG = (hex) => {
		// Ensure the hex code is exactly 2 digits
		let _hex = hex || []
		if (_hex.length === 3) {
			_hex += _hex
		}
		if (_hex.length !== 6) {
			throw new Error('Invalid hex color format. It should be 6 digits.')
		}
		let output = parseInt(hex, 16)
		output = Math.floor(output)
		output = Math.min(255, Math.max(0, output))
		const rDecimalValue = parseInt(hex.substring(0, 2), 16)
		const gDecimalValue = parseInt(hex.substring(2, 4), 16)
		const bDecimalValue = parseInt(hex.substring(4, 6), 16)

		// Use the decimal value for each RGB component to create a shade of gray
		return `${rDecimalValue}, ${gDecimalValue}, ${bDecimalValue}`
	}
	function hexToComplement(hex) {
		// Ensure the input is a valid 6-digit hex color
		if (!/^#?([A-Fa-f0-9]{6})$/.test(hex)) {
			throw new Error("Invalid hex color")
		}
	
		// Remove the hash if it exists
		hex = hex.replace(/^#/, '')
	
		// Convert the hex color to RGB
		const r = parseInt(hex.slice(0, 2), 16)
		const g = parseInt(hex.slice(2, 4), 16)
		const b = parseInt(hex.slice(4, 6), 16)
	
		// Calculate the complement
		const compR = 255 - r;
		const compG = 255 - g;
		const compB = 255 - b;
	
		// Convert the complement RGB values back to hex
		const compHex = ((compR << 16) | (compG << 8) | compB).toString(16).padStart(6, '0')
	
		return `${compHex}`;
	}
	return `
			<style>
			:root{
				--bh-primary: #${scheme};
				--bh-primary-rgb: ${hexToRBG(scheme)};
				--bh-secondary: #${hexToComplement(scheme)};
				--bh-secondary-rgb: ${hexToRBG(hexToComplement(scheme))};
			}
			</style>
	`
}

module.exports = {
    applyCSSTheme: applyCSSTheme
}