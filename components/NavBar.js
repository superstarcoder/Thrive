import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Color from '../assets/themes/Color';
import NavBarButtons from './NavBarButtons';
import { useColorsStateContext } from './ColorContext';

const NavBar = ({ currentPage, setCurrentPage }) => {

	const { ColorState, setColorState } = useColorsStateContext();
	const styles = getDynamicStyles(ColorState)


	const onNavBarButtonPress = async (pageName) => {
		if (currentPage != pageName) {
			setCurrentPage(pageName)
		}
	}

	return (
		<View style={styles.navbarContainer}>
			<View style={styles.navbar}>
				<NavBarButtons label={"settings"} onNavBarButtonPress={onNavBarButtonPress} currentPage={currentPage} />
				<NavBarButtons label={"stats"} onNavBarButtonPress={onNavBarButtonPress} currentPage={currentPage} />
				<NavBarButtons label={"home"} onNavBarButtonPress={onNavBarButtonPress} currentPage={currentPage} />
				<NavBarButtons label={"stats"} onNavBarButtonPress={onNavBarButtonPress} currentPage={currentPage} />
				<NavBarButtons label={"AI"} onNavBarButtonPress={onNavBarButtonPress} currentPage={currentPage} />
			</View>
		</View>
	)
}

export default NavBar


const getDynamicStyles = (ColorState) => ({
	navbarContainer: {
		marginTop: "auto",
		display: "flex",
		backgroundColor: ColorState?.DarkestBlue,
		height: 90,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 35
	},
	navbar: {
		borderRadius: 30,
		backgroundColor: ColorState?.NavBarColor,
		height: 70,
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		alignSelf: "center",
		bottom: 0,
		width: "100%",
		// width: "80%",
		shadowColor: "black",
		paddingHorizontal: 23,
		paddingBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 1,
		shadowRadius: 5,
	},
});