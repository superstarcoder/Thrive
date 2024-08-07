import { StyleSheet, Text, View } from 'react-native'
import WheelPicker from 'react-native-wheely';
import { useState } from 'react';
import React from 'react'
import Color from '../../assets/themes/Color';
import { ACTIONS } from '../../utils/Actions_TaskSettingsModal';

const ScrollSelect = ({dataArray, selectedIndex, setSelectedIndex, dispatch}) => {

	const onChange = (index) => {
		setSelectedIndex(index)
		dispatch({ type: ACTIONS.UPDATE_DURATION, payload: { duration: dataArray[index] } })
	}

	return (
		<WheelPicker
			selectedIndex={selectedIndex}
			visibleRest={1}
			options={dataArray}
			onChange={onChange}
			itemHeight={40}
			selectedIndicatorStyle={styles.selectedIndicatorStyle}
			itemTextStyle={styles.itemTextStyle}
			scaleFunction={(x) => 1 - (1/5)**x }
			decelerationRate={"fast"}
		/>
	);
}

export default ScrollSelect

const styles = StyleSheet.create({
	selectedIndicatorStyle: {
		backgroundColor: Color.DarkBlue
	},
	itemTextStyle: {
		color: Color.TextColor
	}
})