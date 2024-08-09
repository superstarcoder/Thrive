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

// Thrive Blue
const DarkestBlue = '#151934' // background
const DarkBlue = '#252F68' // foreground (tasks, habits)
const TextColor = '#FFFFFF' // regular text, small text
const TextColorOnBg = '#FFFFFF' // regular text, small text
const TextColorOnGrayBlueBg = '#FFFFFF'
const LightBlue = '#94A5FF' // NavBar buttons, background of text
const Blue = '#6A80F7'
const RedAccent = '#F76969' // high priority task accent
const BlueAccent = '#64ABFF' // medium priority task accent
const GreenAccent = '#3AA840' // low priority task accent
const GrayBlue = '#252B55'
const Gray = '#C8C8C8'
const GrayOnBg = '#C8C8C8'
const DarkGray = "#6F6F6F"
const StreaksBarBg = "#6F6F6F"
const Red = "#C90000"
const StreaksBar = '#FF6B37'
const ThemeAccent = "#6A80F7"
const IconColor="black"
const NavBarColor="#151934"
const NavBarButtonsColor="#6A80F7"
const NavBarIconsColor="black"
const CheckBoxColor="black"
const DateTimeInfoContainer="hsl(0, 0%, 24%)"
const PlaceholderTextColor="#252B55"

const Color = {
	PlaceholderTextColor,
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
	NavBarButtonsColor,
	NavBarIconsColor,
	CheckBoxColor,
	StreaksBarBg,
	adjustBrightness,
	TextColorOnGrayBlueBg,
	DateTimeInfoContainer
}

export default Color