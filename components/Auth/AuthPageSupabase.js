import { titleToTheme } from "../../assets/themes/ThemeColors";
import { supabase } from "../../lib/supabase"

import { USER_INIT_SETTINGS } from "../../utils/AppConstants"

/**
 * If user settings row does not exist in the table: create one, based on USER_INIT_SETTINGS constant
 * If user settings does exist, then get user settings from the tasks table
 * 
 * @return returns the new user settings
 */
export const supabaseLoadUserSettings = async ({ user, setUserSettings, setColorState }) => {
	// Get the authenticated user's ID
	// const { data: user } = await supabase.auth.getUser();
	const uid = user?.id;
	// console.log({uid})

	// if user is not authenticated, we don't do anything
	if (!uid) {
		// console.log('User is not authenticated.');
		return null;
	}

	// Check if the user's UID exists in the UserSettings table
	const { data: existingUserSettings, error: fetchError } = await supabase
		.from('UserSettings')
		.select('*')
		.eq('user_uid', uid)
		.single();

	if (fetchError && fetchError.code !== 'PGRST116') {
		console.error('Error fetching user settings:', fetchError.message);
		return null;
	}

	var userSettingsToApply
	if (existingUserSettings) {
		userSettingsToApply = existingUserSettings
	} else {
		// If the user's UID does not exist, insert a new row
		const userInitSettings = {...USER_INIT_SETTINGS}
		userInitSettings["user_uid"] = uid
		const { data: newUserSettings, error: insertError } = await supabase
			.from('UserSettings')
			.insert([userInitSettings])
			.single();

		if (insertError) {
			console.error('Error inserting user settings:', insertError.message);
			return null;
		}

		userSettingsToApply = userInitSettings;
		console.log("inserted new user settings in table")
		console.log({userSettingsToApply})
	}

	// apply 
	// console.log({ userSettingsToApply })
	setUserSettings(userSettingsToApply)
	setColorState(titleToTheme[userSettingsToApply.selectedTheme])
	return userSettingsToApply
}

/**
 * This function updates the local states and db for user settings, based on updateDict
 * Note: userSettings MUST have a valid user_uid property for update to be successful
 * @param {Object} updateDict dictionary that indicates which properties need to be updated
 * @param {userSettings} userSettings state
 * @param {setUserSettings} setUserSettings state setter
 * @param {user} user supabase authenticated user object
 */
export const supabaseUpdateUserSettings = async ({ updateDict, userSettings, setUserSettings, setColorState }) => {


	// update local states according to updateDict
	const userSettingsCopy = { ...userSettings }
	for (let [taskProperty, propertyNewValue] of Object.entries(updateDict)) {
		if (!userSettings.hasOwnProperty(taskProperty)) {
			console.error("supabaseUpdateUserSettings: You're trying to update a property of userSettings that doesn't exist")
		}
		userSettingsCopy[taskProperty] = propertyNewValue
	}
	setUserSettings(userSettingsCopy)


	// apply new settings' changes locally
	if ("selectedTheme" in updateDict) {
		setColorState(titleToTheme[updateDict.selectedTheme])
	}

	// update database according to updateDict
	updateDict.user_uid = userSettings.user_uid
	// console.log({updateDict})

	const { error} = await supabase
		.from('UserSettings')
		.update(updateDict)
		.eq('user_uid', updateDict.user_uid)
	
	if (error) console.warn(error)
	// console.log({data})
}