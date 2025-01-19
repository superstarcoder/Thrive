import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import FlameIcon from "../../assets/flame_icon.svg";
import { StyledH1, StyledH2, StyledH3, StyledH4 } from "../text/StyledText";
import { useColorsStateContext } from "../ColorContext";
import { Repeat, Trash } from "phosphor-react-native";
import { supabaseAddReward, supabaseDeleteReward, supabaseUpdateReward } from "./RewardsPageSupabase";
import { supabaseUpdateUserSettings } from "../Auth/AuthPageSupabase";

const RewardItem = ({ title, embers_cost, recurring, canClaim, rewardId, user_uid, setRewardItems, claimed, userSettings, setUserSettings }) => {
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState);

  let goldenBorderColor = {};

  if (canClaim) {
    goldenBorderColor = { borderColor: "#C7911A" };
  }

  if (claimed) {
    goldenBorderColor = { borderColor: ColorState?.GreenAccent };
  }

  const onDeletePress = async () => {
    console.log("attempting to delete");
    await supabaseDeleteReward({ rewardId, setRewardItems, user_uid });
  };

  const onClaimRewardPress = async () => {
    // make it claimed
    await supabaseUpdateReward({ updateDict: { claimed: true }, rewardId, user_uid, setRewardItems });
    // add a duplicate of current reward if it is recurring
    if (recurring) {
      console.log("is recurring, creating duplicate");
      await supabaseAddReward({ newRewardSettings: { title: title, embers_cost: embers_cost, recurring: true }, user_uid, setRewardItems });
    }

    console.log("hello!!")
    console.log({"total_spent_embers": userSettings.total_spent_embers})

    if (canClaim) {
      console.log("trying to update user settings")
      await supabaseUpdateUserSettings({updateDict: {total_spent_embers: userSettings.total_spent_embers + embers_cost}, userSettings, setUserSettings})
    }
  };
  return (
    <View style={[styles.rewardContainer, goldenBorderColor]}>
      <StyledH2 text={title} style={styles.rewardTitle} />
      <View style={styles.rewardDetails}>
        <View style={styles.costDetail}>
          <StyledH3 text={"Cost:"} />
          <View style={styles.embersBox}>
            <StyledH2 text={embers_cost} style={styles.embersCostText} />
            <FlameIcon height={30} width={30} style={styles.flameIcon} />
          </View>
        </View>
        {canClaim && (
          <TouchableOpacity onPress={onClaimRewardPress}>
            <View style={styles.claimButton}>
              <StyledH2 text={"Claim Reward"} style={styles.claimButtonText} />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onDeletePress}>
          <View style={styles.deleteRewardButton}>
            <Trash size={25} weight="bold" color={ColorState?.IconColor} />
          </View>
        </TouchableOpacity>
      </View>
      {recurring && (
        <View style={styles.repeatDetail}>
          <Repeat size={20} weight="fill" color={ColorState?.Blue} style={styles.repeatIcon} />
          <StyledH4 text={"is recurring"} style={{ color: ColorState?.Gray }} />
        </View>
      )}
    </View>
  );
};

export default RewardItem;

const getDynamicStyles = (ColorState) => ({
  // recurring detail
  repeatDetail: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  repeatIcon: {
    // marginRight: 6,
  },

  rewardContainer: {
    flexDirection: "column",
    backgroundColor: ColorState?.DarkBlue,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: ColorState?.RedAccent,
  },
  rewardTitle: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  rewardDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  embersBox: {
    flexDirection: "row",
    backgroundColor: ColorState?.Blue,
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 3,
    gap: 4,
  },
  claimButton: {
    backgroundColor: "#C7911A",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  embersCostText: {
    fontSize: 18,
    color: "black",
    textAlignVertical: "center",
    textAlign: "center",
    alignSelf: "center",
    marginLeft: 4,
  },
  claimButtonText: {
    color: "black",
    fontSize: 18,
  },
  costDetail: {
    flexDirection: "row",
    textAlign: "center",
    textAlignVertical: "center",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  deleteRewardButton: {
    backgroundColor: ColorState?.RedAccent,
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

const testStyles = StyleSheet.create({
  test: {},
});
