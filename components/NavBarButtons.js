import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react'
import { Gear, House, ChartBar, Sparkle } from 'phosphor-react-native';
import Color from '../assets/themes/Color';

/**
 * represents a single button in the navbar
 * @param {string} label settings/home/stats/AI 
 * @returns 
 */
const NavBarButtons = ({label, onNavBarButtonPress, currentPage}) => {

	let selectedStyle;

	if (label == currentPage) {
		selectedStyle = {
			// backgroundColor: Color.LightBlue
			backgroundColor: Color.Blue
		}
	} else {
		selectedStyle = {
			backgroundColor: Color.LightBlue
		}
	}
	if (label == "home") {
		selectedStyle["width"] = 47
		selectedStyle["height"] = 47
	}

	const renderIcon = (label) => {
		if (label == currentPage) {
			if (label == "settings") return <Gear size={30} weight="fill" color={Color.DarkBlue} style={[styles.buttonIcon]} />
			if (label == "home") return <House size={35} weight="fill" color={Color.DarkBlue} style={styles.homeIcon} />
			if (label == "stats") return <ChartBar size={30} weight="fill" color={Color.DarkBlue} style={[styles.buttonIcon]} />
			if (label == "AI") return <Sparkle size={30} weight="fill" color={Color.DarkBlue} style={[styles.buttonIcon]} />
		}
		else {
			if (label == "settings") return <Gear size={30} weight="regular" color={"black"} style={[styles.buttonIcon]} />
			if (label == "home") return <House size={35} weight="regular" color={"black"} style={styles.buttonIcon} />
			if (label == "stats") return <ChartBar size={30} weight="regular" color={"black"} style={[styles.buttonIcon]} />
			if (label == "AI") return <Sparkle size={30} weight="regular" color={"black"} style={[styles.buttonIcon]} />
		}
	}

  return (
	<TouchableOpacity onPress={() => {onNavBarButtonPress(label)}}>
		<View style={[styles.navBarButton, selectedStyle]}>
			{renderIcon(label)}
		</View>
  	</TouchableOpacity>
  )
}

export default NavBarButtons

const styles = StyleSheet.create({
	navBarButton: {
		// backgroundColor: Color.Blue,
		width: 40,
		height: 40,
		borderRadius: 12,
		justifyContent: 'center',
		// marginRight: 20,
		alignItems: 'center',
	  },
})