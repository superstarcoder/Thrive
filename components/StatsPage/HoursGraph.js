import { LineChart } from "react-native-gifted-charts"
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Color from '../../assets/themes/Color'
import { StyledH1, StyledH2, StyledH3, fontStyles } from '../text/StyledText';
import { BarChart } from 'react-native-gifted-charts';


const HoursGraph = ({ taskItems, habitHistory }) => {

    const [hoursData, setHoursData] = useState()

    // Function to format date as month/day/year
    function formatDate(date) {
        const month = date.getMonth() + 1; // Months are zero-indexed
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    function getLast7DaysDictionary() {
        const dictionary = {};
        const today = new Date();

        // Iterate over the last 7 days including today
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i); // Go back i days
            const formattedDate = formatDate(date);
            dictionary[formattedDate] = { "complete_hours": 0, "incomplete_ignored_hours": 0, "exempt_todo_hours": 0 };
        }

        return dictionary;
    }

    function isWithinLast7Days(givenDate) {
        // Get today's date and reset time to midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Calculate the date 7 days ago and reset time to midnight
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Convert givenDate to a Date object if it's not already
        const dateToCheck = new Date(givenDate);
        dateToCheck.setHours(0, 0, 0, 0);

        // Check if the dateToCheck is within the range
        return dateToCheck >= sevenDaysAgo && dateToCheck <= today;
    }

    const getTaskHoursData = () => {
        // console.log(taskItems)
        if (taskItems == undefined) return

        // create dictionary for last 7 days
        const dateToHours = getLast7DaysDictionary()

        for (const task of taskItems) {
            if (task == undefined) continue

            if (Object.keys(dateToHours).includes(formatDate(task.dueDate))) {
                console.log(task.status)
                if (task.status == "complete") {
                    dateToHours[formatDate(task.dueDate)]["complete_hours"] += task.duration
                } else if (task.status == "incomplete_ignored") {
                    dateToHours[formatDate(task.dueDate)]["incomplete_ignored_hours"] += task.duration
                } else if (task.status == "incomplete" || task.status == "exempt") {
                    dateToHours[formatDate(task.dueDate)]["exempt_todo_hours"] += task.duration
                }
            }
        }

        for (const [habitId, habitEntriesArray] of Object.entries(habitHistory)) {

            if (habitId == undefined) continue

            habitEntriesArray.sort((a, b) => new Date(b.habit_due_date) - new Date(a.habit_due_date));
            for (const historyEntry of habitEntriesArray) {
                if (historyEntry == undefined) continue
                if (!isWithinLast7Days(new Date(historyEntry.habit_due_date))) {
                    break
                };

                let dueDate = new Date(historyEntry.habit_due_date)

                // console.log(historyEntry.status, (new Date(historyEntry.habit_due_date)).toLocaleDateString())
                if (Object.keys(dateToHours).includes(formatDate(dueDate))) {
                    let habitInfo = taskItems.find(x => x.id == habitId)
                    if (habitInfo == undefined) continue

                    if (historyEntry.status == "incomplete") {
                        dateToHours[formatDate(dueDate)]["incomplete_ignored_hours"] += habitInfo.duration
                    } else if (historyEntry.status == "complete") {
                        dateToHours[formatDate(dueDate)]["complete_hours"] += habitInfo.duration
                    } else if (historyEntry.status == "exempt" || historyEntry.status == "pending") {
                        dateToHours[formatDate(dueDate)]["exempt_todo_hours"] += habitInfo.duration
                    }
                }
            }
        }



        console.log(dateToHours)

        const newHoursData = []
        for (const [dateText, hours_data] of Object.entries(dateToHours)) {

            my_bar = { stacks: [], label: dateText.slice(0, -5) }

            my_bar.stacks.push({ value: hours_data["complete_hours"], color: Color.GreenAccent })
            my_bar.stacks.push({ value: hours_data["exempt_todo_hours"], color: Color.BlueAccent })
            my_bar.stacks.push({ value: hours_data["incomplete_ignored_hours"], color: Color.RedAccent })

            newHoursData.push(my_bar)
        }
        setHoursData(newHoursData)
        console.log(JSON.stringify(newHoursData, null, 2))
    }

    useEffect(() => {
        getTaskHoursData()
    }, [])

    const renderTitle = () => {
        return (
            <View style={{ marginVertical: 10 }}>
                <Text
                    style={[fontStyles.styledH2, styles.titleText]}>
                    Last 7 Days Tasks & Habits
                </Text>
                <View
                    style={styles.labelsLegendContainer}>
                    <View style={styles.labelLegend}>
                        <View style={styles.greenDot} />
                        <Text style={styles.labelLegendText}> complete </Text>
                    </View>
                    <View style={styles.labelLegend}>
                        <View style={styles.blueDot} />
                        <Text style={styles.labelLegendText}> exempt / todo </Text>
                    </View>
                    <View style={styles.labelLegend}>
                        <View style={styles.redDot} />
                        <Text style={styles.labelLegendText}> incomplete </Text>
                    </View>
                </View>
            </View>
        )
    }



    return (
        <View
            style={styles.hoursGraphContainer}>
            {renderTitle()}
            <View style={styles.graphAndTitle}>

                {/* <View style={styles.yAxisTitleContainer}>
                    <Text style={[fontStyles.styledH2, styles.yAxisTitle]}>
                        hours
                    </Text>
                </View> */}

                <View style={styles.barChartContainer}>
                    <BarChart
                        barWidth={20}
                        spacing={15}
                        noOfSections={5}
                        barBorderRadius={6}
                        stackData={hoursData}
                        xAxisColor={Color.Blue}
                        yAxisColor={Color.Blue}
                        xAxisLabelTextStyle={{ color: "white", fontSize: 10 }}
                        yAxisTextStyle={{ color: "white", fontSize: 10 }}
                    // labelTextStyle={{color: 'gray'}}
                    />
                </View>
            </View>
        </View>
    );
}

export default HoursGraph


const styles = StyleSheet.create({
    hoursGraphContainer: {
        margin: 12,
        padding: 16,
        borderRadius: 20,
        // backgroundColor: '#232B5D',
        backgroundColor: Color.GrayBlue,
    },
    titleText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    labelsLegendContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: 'space-evenly',
        marginTop: 24,
    },
    labelLegend: { flexDirection: 'row', alignItems: 'center' },
    greenDot: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: Color.GreenAccent,
        marginRight: 8,
    },
    blueDot: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: Color.BlueAccent,
        marginRight: 8,
    },
    redDot: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: Color.RedAccent,
        marginRight: 8,
    },
    labelLegendText: { color: "lightgray" },
    barChartContainer: {
        padding: 10,
        alignItems: 'center'
    },
    graphAndTitle: {
        flexDirection: 'row',
        justifyContent: "flex-start"
    },
    yAxisTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    yAxisTitleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '-90deg' }],
    }
})