import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Color from '../assets/themes/Color';
import NavBarButtons from './NavBarButtons';

const NavBar = ({currentPage, setCurrentPage}) => {

	const onNavBarButtonPress = async (pageName) => {
		if (currentPage != pageName) {
			console.log("in: "+currentPage)
			console.log("going to page: "+pageName)
			setCurrentPage(pageName)
		}
		// if (pageName == "settings") {
		// 	await signOutUser()
		// }
	}

  return (
		<View style={styles.navbarContainer}>
            <View style={styles.navbar}>
				<NavBarButtons label={"settings"} onNavBarButtonPress={onNavBarButtonPress} currentPage={currentPage}/>
				<NavBarButtons label={"home"} onNavBarButtonPress={onNavBarButtonPress} currentPage={currentPage}/>
				<NavBarButtons label={"stats"} onNavBarButtonPress={onNavBarButtonPress} currentPage={currentPage}/>
				<NavBarButtons label={"AI"} onNavBarButtonPress={onNavBarButtonPress} currentPage={currentPage}/>
            </View>
          </View>
  )
}

export default NavBar

const styles = StyleSheet.create({
	navbarContainer: {
		marginTop: "auto",
		display: "flex",
		backgroundColor: Color.GrayBlue,
		height: 90,
		justifyContent: "center",
		alignItems: "center",
	  },
	  navbar: {
		borderRadius: 30,
		backgroundColor: Color.DarkestBlue,
		height: 70,
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		alignSelf: "center",
		bottom: 0,
		width: "80%",
		shadowColor: "black",
		shadowOpacity: 0.2,
		paddingHorizontal: 30,
		paddingBottom: 10,
	  },
})