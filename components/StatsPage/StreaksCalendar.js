import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Color from '../../assets/themes/Color'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { StyledH1, StyledH2 } from '../text/StyledText';

const StreaksCalendar = ({ habitStats, markedDates, title }) => {
	// console.log(JSON.stringify(habitStats,))
	return (
		<View style={styles.container}>
			<StyledH2 text={title} style={styles.sectionHeading} />
			<Calendar
				// Customize the appearance of the calendar
				style={styles.myCalendar}
				// Specify the current date
				current={(new Date()).toISOString()}
				
				// Callback that gets called when the user selects a day
				onDayPress={day => {
					// console.log('selected day', day);
				}}

				theme={{
					calendarBackground: Color.GrayBlue,
					textDayFontWeight: '500',
					// dayTextColor: '#fff',
					dayTextColor: "#666666",
					textDisabledColor: '#707371',
					monthTextColor: '#fff'
				}}
				// Mark specific dates as marked
				markedDates={markedDates}
				markingType={'period'}
			/>
		</View>
	)
}

export default StreaksCalendar


const styles = StyleSheet.create({
	scrollView: {
		paddingTop: 100,
	},
	sectionHeading: {
		alignSelf: "center"
	},
	container: {
		gap: 10,
	},
	text: {
		color: Color.White,
	},

	sectionTitle: {
		marginBottom: 20,
	},

	myCalendar: {
		display: "flex",
		borderColor: 'gray',
		borderRadius: 10,
		// margin: 12,
		// elevation: 5,
		borderWidth: 0,
		// borderColor: 'rgba(100, 100, 100, 0.2)'
	}

});