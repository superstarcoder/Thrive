import { HABIT_HISTORY_COLUMNS, HABIT_TASKS_TABLE_COLUMNS } from "./AppConstants";

export function deepCopyObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}

export function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
}

export function objIsEmpty(obj) {
    return Object.keys(obj).length === 0;
}

export function getHabitHistoryUpdateDict({ initialHabitSettings, habitSettingsEdited }) {
	const updateDict = {}
	for (const col of HABIT_HISTORY_COLUMNS) {
		// we want to compare the VALUES of the two Date objects, not the references 
		if (col == "dueDate") {
			let time1 = new Date(initialHabitSettings[col]).getTime()
			let time2 = new Date(habitSettingsEdited[col]).getTime()
			console.log(time1)
			console.log(time2)
			if (time1 != time2) {
				updateDict.dueTimeOverride = (new Date(habitSettingsEdited[col])).toISOString()
			}
			continue
		}
		if (initialHabitSettings[col] != habitSettingsEdited[col]) {
			updateDict[col] = habitSettingsEdited[col]
		}
	}

	return updateDict
}

export function getHabitTasksTableUpdateDict({ initialHabitSettings, habitSettingsEdited }) {
	const updateDict = {}
	for (const col of HABIT_TASKS_TABLE_COLUMNS) {
		// we want to compare the VALUES of the two list objects, not the references
		if (col == "repeatDays") {
			if (!arraysEqual(initialHabitSettings[col]), habitSettingsEdited[col]) {
				updateDict[col] = habitSettingsEdited[col]
			}
			continue
		}
		// we want to compare the VALUES of the two Date objects, not the references 
		if (col == "repeat_days_edited_date") {
			let time1 = new Date(initialHabitSettings[col]).getTime()
			let time2 = new Date(habitSettingsEdited[col]).getTime()
			console.log({time1, time2})
			if (time1 != time2) {
				updateDict[col] = new Date(habitSettingsEdited[col])
			}
			continue
		}
		if (initialHabitSettings[col] != habitSettingsEdited[col]) {
			updateDict[col] = habitSettingsEdited[col]
		}
	}

	return updateDict
}