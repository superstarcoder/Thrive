import { StyleSheet, Text, View } from 'react-native'
import WheelPicker from 'react-native-wheely';
import { useState } from 'react';
import React from 'react'
import Color from '../../assets/themes/Color';
import { ACTIONS } from '../../utils/Actions_TaskSettingsModal';
import { useColorsStateContext } from '../ColorContext';

const ScrollSelect = ({ dataArray, selectedIndex, setSelectedIndex, dispatch }) => {

	const { ColorState, setColorState } = useColorsStateContext();
	const styles = getDynamicStyles(ColorState)

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
			scaleFunction={(x) => 1 - (1 / 5) ** x}
			decelerationRate={"fast"}
		/>
	);
}

export default ScrollSelect

const getDynamicStyles = (ColorState) => ({
	selectedIndicatorStyle: {
		backgroundColor: ColorState?.DarkBlue
	},
	itemTextStyle: {
		color: ColorState?.TextColor
	}
});