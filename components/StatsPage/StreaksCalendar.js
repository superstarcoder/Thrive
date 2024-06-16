import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Color from '../../assets/themes/Color'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { StyledH1, StyledH2 } from '../text/StyledText';

const StreaksCalendar = ({ habitStats, markedDates }) => {
	console.log(JSON.stringify(habitStats,))
	return (
		<View style={styles.container}>
			<StyledH2 text={"7.5+ hours of sleep"} style={styles.sectionHeading} />
			<Calendar
				// Customize the appearance of the calendar
				style={styles.myCalendar}
				// Specify the current date
				current={(new Date()).toISOString()}
				
				// Callback that gets called when the user selects a day
				onDayPress={day => {
					console.log('selected day', day);
				}}

				theme={{
					calendarBackground: '#222',
					dayTextColor: '#fff',
					textDisabledColor: '#444',
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
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 5,
		// margin: 12,
		elevation: 5,
		borderWidth: 4,
		borderColor: 'rgba(100, 100, 100, 0.2)'
	}

});