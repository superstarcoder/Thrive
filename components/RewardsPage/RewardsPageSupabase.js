
import { supabase } from "../../lib/supabase";

/**
 * This function updates the local states and db for user settings, based on updateDict
 * Note: userSettings MUST have a valid user_uid property for update to be successful
 * @param {Object} updateDict dictionary that indicates which properties need to be updated
 * @param {userSettings} userSettings state
 * @param {setUserSettings} setUserSettings state setter
 * @param {user} user supabase authenticated user object
 */
export const supabaseAddReward = async ({ newRewardSettings, user_uid }) => {
  // update local states according to updateDict
  // TODO

  newRewardSettings = { ...newRewardSettings, user_id: user_uid };
  newRewardSettings.embers_cost = parseInt(newRewardSettings.embers_cost, 10);
  console.log({ newRewardSettings });

  const { data, error } = await supabase.from("Rewards").insert(newRewardSettings);
  if (error) console.warn(error);
};
