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


// Sky Blue
// const DarkestBlue = '#7B81B7' // background
// const DarkBlue = '#34385F' // foreground (tasks, habits)
// const TextColor = '#DDE4FF' // regular text, small text
// const TextColorOnBg = '#34385F' // regular text, small text
// const TextColorOnGrayBlueBg = '#DDE4FF'
// const LightBlue = '#4d5eb0' // NavBar buttons, background of text
// const Blue = '#4d5eb0'
// const RedAccent = '#F76969' // high priority task accent
// const BlueAccent = '#94A5FF' // medium priority task accent
// const GreenAccent = '#61AF65' // low priority task accent
// const GrayBlue = '#34385F'
// const Gray = '#C8C8C8'
// const GrayOnBg = '#3e3e3e'
// const DarkGray = "#6F6F6F"
// const StreaksBarBg = "#6F6F6F"
// const Red = "#C90000"
// const StreaksBar = '#e58a69'
// const ThemeAccent = "#6A80F7"
// const IconColor="#111748"
// const NavBarColor="#2b2e4b"
// const NavBarButtonsColor="#94A5FF"
// const NavBarIconsColor="black"
// const CheckBoxColor="black"
// const DateTimeInfoContainer="hsl(0, 0%, 24%)"
// const PlaceholderTextColor="#34385F"



// Deep Purple
// const DarkestBlue = '#231942' // background
// const DarkBlue = '#554C80' // foreground (tasks, habits)
// const TextColor = '#ECD0DF' // regular text, small text
// const TextColorOnBg = '#ECD0DF' // regular text, small text
// const TextColorOnGrayBlueBg = '#ECD0DF'
// const LightBlue = '#9F86C0' // NavBar buttons, background of text
// const Blue = '#8a7dc8'
// const RedAccent = '#F76969' // high priority task accent
// const BlueAccent = '#94A5FF' // medium priority task accent
// const GreenAccent = '#629f65' // low priority task accent
// const GrayBlue = '#5E548E'
// const Gray = '#C8C8C8'
// const GrayOnBg = '#C8C8C8'
// const DarkGray = "#6F6F6F"
// const StreaksBarBg = "#6F6F6F"
// const Red = "#ff5e5e"
// const StreaksBar = '#d58e74'
// const ThemeAccent = "#9F86C0"
// const IconColor="black"
// const NavBarColor="#151934"
// const NavBarButtonsColor="#8a7dc8"
// const NavBarIconsColor="black"
// const CheckBoxColor="#231942"
// const DateTimeInfoContainer="hsl(0, 0%, 24%)"
// const PlaceholderTextColor="#5E548E"


// Ocean Mist
// const DarkestBlue = 'hsl(216, 49%, 58%)' // background
// const DarkBlue = '#C4CAEA' // foreground (tasks, habits)
// const TextColor = '#293B46' // regular text, small text
// const TextColorOnBg = '#C4CAEA' // regular text, small text
// const TextColorOnGrayBlueBg = '#293B46'
// const LightBlue = 'hsl(230, 100%, 83%)' // NavBar buttons, background of text
// const Blue = '#94A5FF'
// const RedAccent = '#fa9898' // high priority task accent
// const BlueAccent = '#94A5FF' // medium priority task accent
// const GreenAccent = '#6ecb73' // low priority task accent
// const GrayBlue = '#C4CAEA'
// const Gray = '#646464'
// const GrayOnBg = '#3e3e3e'
// const DarkGray = "#6F6F6F"
// const StreaksBarBg = "#adadad"
// const Red = "#ffa2a2"
// const StreaksBar = '#e58a69'
// const ThemeAccent = "hsl(216, 49%, 68%)"
// const IconColor="#4d6fa2"
// const NavBarColor="#C4CAEA"
// const NavBarButtonsColor="#608AC9"
// const NavBarIconsColor="#C4CAEA"
// const CheckBoxColor="#608AC9"
// const DateTimeInfoContainer="hsl(230, 100%, 83%)"
// const PlaceholderTextColor="#a0a0a0"


// Cotton candy
// const DarkestBlue = 'hsl(320, 50%, 55%)'
// const DarkBlue = 'hsl(320, 47%, 75%)' // foreground (tasks, habits)
// const GrayBlue = '#D07CB5'
// const TextColor = '#462932' // regular text, small text
// const TextColorOnBg = '#462932' // regular text, small text
// const TextColorOnGrayBlueBg = '#462932'
// const LightBlue = '#EAC4DD' // NavBar buttons, background of text
// const Blue = '#a65ca0'
// const RedAccent = '#EF6B6B' // high priority task accent
// const BlueAccent = '#867ed9' // medium priority task accent
// const GreenAccent = '#629965' // low priority task accent
// const Gray = '#535353'
// const GrayOnBg = '#C8C8C8'
// const DarkGray = "#959595"
// const StreaksBarBg = "#959595"
// const Red = "#ff5e5e"
// const StreaksBar = '#b04d29'
// const ThemeAccent = "#c086bf"
// const IconColor="hsl(319, 49%, 35%)"
// const NavBarColor="hsl(320, 50%, 45%)"
// const NavBarButtonsColor="#9e6aa5"
// const NavBarIconsColor="black"
// const CheckBoxColor="#C960A7"
// const DateTimeInfoContainer="hsl(0, 0%, 24%)"
// const PlaceholderTextColor="#D07CB5"

// elegant green
// const DarkestBlue = 'hsl(170, 49%, 48%)'
// const DarkBlue = '#C4EAE1' // foreground (tasks, habits)
// const GrayBlue = '#C4EAE1'
// const TextColor = '#294634' // regular text, small text
// const TextColorOnBg = '#294634' // regular text, small text
// const TextColorOnGrayBlueBg = '#294634'
// const LightBlue = '#C4EAE1' // background of text
// const Blue = '#499080'
// const RedAccent = '#f59292' // high priority task accent
// const BlueAccent = '#80ade0' // medium priority task accent
// const GreenAccent = '#61d68a' // low priority task accent
// const Gray = '#737373'
// const StreaksBarBg = "#b7b7b7"
// const GrayOnBg = '#646464'
// const DarkGray = "#b7b7b7"
// const Red = "#ff5e5e"
// const StreaksBar = '#dc8565'
// const ThemeAccent = "hsl(170, 49%, 48%)"
// const IconColor="#294634"
// const NavBarColor="hsl(170, 49%, 78%)"
// const NavBarButtonsColor="hsl(170, 49%, 48%)"
// const NavBarIconsColor="black"
// const CheckBoxColor="#60C9B0"
// const DateTimeInfoContainer="hsl(0, 0%, 78%)"
// const PlaceholderTextColor="#6c706f"

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

export default Color;