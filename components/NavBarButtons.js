import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react'
import { Gear, House, ChartBar, Sparkle } from 'phosphor-react-native';
import Color from '../assets/themes/Color';


const NavBarButtons = ({label, onNavBarButtonPress, currentPage}) => {

	let selectedStyle;
	if (label == currentPage) {
		selectedStyle = {
			backgroundColor: Color.LightBlue
		}
	} else {
		selectedStyle = {
			backgroundColor: Color.Blue
		}
	}


  return (
	<TouchableOpacity onPress={() => {onNavBarButtonPress(label)}}>
		<View style={[styles.navBarButton, selectedStyle]}>
		{label == "settings" &&
	 	 	<Gear size={30} weight="bold" color={"black"} style={[styles.buttonIcon]} />
		}
		{label == "home" &&
	 	 	<House size={30} weight="bold" color={"black"} style={[styles.buttonIcon]} />
		}
		{label == "stats" &&
	 	 	<ChartBar size={30} weight="bold" color={"black"} style={[styles.buttonIcon]} />
		}
		{label == "AI" &&
	 	 	<Sparkle size={30} weight="bold" color={"black"} style={[styles.buttonIcon]} />
		}
		</View>
  	</TouchableOpacity>
  )
}

export default NavBarButtons

const styles = StyleSheet.create({
	navBarButton: {
		// backgroundColor: Color.Blue,
		width: 45,
		height: 45,
		borderRadius: 12,
		justifyContent: 'center',
		marginRight: 20,
		alignItems: 'center',
	  },
})