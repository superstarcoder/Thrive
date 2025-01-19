import { supabase } from "../../lib/supabase";

export const supabaseGetAllRewards = async ({ setRewardItems, user_uid }) => {
  console.log({ user_uid });
  const { data, error } = await supabase.from("Rewards").select("*").eq("user_id", user_uid);
  console.log({ data });
  setRewardItems(data);
  if (error) throw error;
};

/**
 * This function updates the local states and db for rewards, based on updateDict
 * Note: newRewardsettings MUST have a valid user_uid property for update to be successful
 * @param {Object} updateDict dictionary that indicates which properties need to be updated
 * @param {userSettings} userSettings state
 * @param {newRewardSettings} setUserSettings state setter
 * @param {user_uid} user_id supabase authenticated user object
 */
export const supabaseAddReward = async ({ newRewardSettings, user_uid, setRewardItems, rewardItems }) => {
  newRewardSettings = { ...newRewardSettings, user_id: user_uid };
  newRewardSettings.embers_cost = parseInt(newRewardSettings.embers_cost, 10);
  console.log({ newRewardSettings });

  console.log("starting insertion");
  const { data, error } = await supabase.from("Rewards").insert(newRewardSettings);
  if (error) console.warn(error);
  console.log("done inserting");

  // update local state
  await supabaseGetAllRewards({ setRewardItems, user_uid });
};

export const supabaseDeleteReward = async ({ rewardId, setRewardItems, user_uid }) => {
  console.log("deleting");
  console.log({ user_uid });
  // update database
  const { error } = await supabase.from("Rewards").delete().eq("id", rewardId).eq("user_id", user_uid);

  if (error) console.warn(error);

  // update local state
  await supabaseGetAllRewards({ setRewardItems, user_uid });
};

export const supabaseUpdateReward = async ({ updateDict, user_uid, rewardId, setRewardItems}) => {
  console.log("updated")
  console.log({user_uid})
  const { data, error } = await supabase.from("Rewards").update(updateDict).eq("id", rewardId).eq("user_id", user_uid);
  if (error) console.warn(error);

  // update local state
  await supabaseGetAllRewards({ setRewardItems, user_uid });
};
