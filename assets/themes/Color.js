function adjustBrightness(hex, percent) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');
    
    // Parse the r, g, b values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Decrease each channel by the specified percentage
    r = Math.max(0, Math.min(255, r * (1 - percent / 100)));
    g = Math.max(0, Math.min(255, g * (1 - percent / 100)));
    b = Math.max(0, Math.min(255, b * (1 - percent / 100)));
    
    // Convert back to hex and pad with zeros if necessary
    let newHex = '#' +
        ("0" + Math.round(r).toString(16)).slice(-2) +
        ("0" + Math.round(g).toString(16)).slice(-2) +
        ("0" + Math.round(b).toString(16)).slice(-2);

    return newHex;
}


// theme colors



// Thrive Blue
// const DarkestBlue = '#151934' // background
// const DarkBlue = '#252F68' // foreground (tasks, habits)
// const TextColor = '#FFFFFF' // regular text, small text
// const TextColorOnBg = '#FFFFFF' // regular text, small text
// const LightBlue = '#94A5FF' // NavBar buttons, background of text
// const Blue = '#6A80F7'
// const RedAccent = '#F76969' // high priority task accent
// const BlueAccent = '#64ABFF' // medium priority task accent
// const GreenAccent = '#3AA840' // low priority task accent
// const GrayBlue = '#252B55'
// const Gray = '#C8C8C8'
// const GrayOnBg = '#C8C8C8'
// const DarkGray = "#6F6F6F"
// const Red = "#C90000"
// const StreaksBar = '#FF6B37'
// const ThemeAccent = "#6A80F7"
// const IconColor="black"
// const NavBarColor="#151934"


// Sky Blue
// const DarkestBlue = '#A6B4FF' // background
// const DarkBlue = '#1D2358' // foreground (tasks, habits)
// const TextColor = '#FFFFFF' // regular text, small text
// const TextColorOnBg = 'black' // regular text, small text
// const LightBlue = '#778eff' // NavBar buttons, background of text
// const Blue = '#6A80F7'
// const RedAccent = '#F76969' // high priority task accent
// const BlueAccent = '#328eff' // medium priority task accent
// const GreenAccent = '#3AA840' // low priority task accent
// const GrayBlue = '#1D2358'
// const Gray = '#C8C8C8'
// const GrayOnBg = '#858585'
// const DarkGray = "#6F6F6F"
// const Red = "#C90000"
// const StreaksBar = '#FF6B37'
// const ThemeAccent = "#6A80F7"
// const IconColor="#6A80F7"
// const NavBarColor="#1D2358"

// Purple Land
const DarkestBlue = '#231942' // background
const DarkBlue = '#5E548E' // foreground (tasks, habits)
const TextColor = '#ECD0DF' // regular text, small text
const TextColorOnBg = '#ECD0DF' // regular text, small text
const LightBlue = '#9F86C0' // NavBar buttons, background of text
const Blue = '#cfc6ff'
const RedAccent = '#F76969' // high priority task accent
const BlueAccent = '#6dc8cd' // medium priority task accent
const GreenAccent = '#629f65' // low priority task accent
const GrayBlue = '#5E548E'
const Gray = '#C8C8C8'
const GrayOnBg = '#C8C8C8'
const DarkGray = "#6F6F6F"
const Red = "#ff5e5e"
const StreaksBar = '#FF6B37'
const ThemeAccent = "#9F86C0"
const IconColor="black"
const NavBarColor="#151934"

const Color = {
	DarkestBlue, 
	DarkBlue, 
	TextColor, 
	LightBlue, 
	Blue, 
	RedAccent, 
	BlueAccent, 
	GreenAccent, 
	GrayBlue,
	Gray,
	StreaksBar,
	DarkGray,
	Red,
	TextColorOnBg,
	ThemeAccent,
	GrayOnBg,
	IconColor,
	NavBarColor,
	adjustBrightness
}

export default Color;