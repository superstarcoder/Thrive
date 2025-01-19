import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import { useColorsStateContext } from "../ColorContext";
import { StyledH1, StyledH2, StyledH3 } from "../text/StyledText";
import FlameIcon from "../../assets/flame_icon.svg";
import RewardSettingsModal from "./RewardSettingsModal";
import RewardItem from "./RewardItem";
import { getTotalEmberCount } from "../TasksPage/TasksPageSupabase";

const RewardsPage = ({ user, rewardItems, setRewardItems, emberStats }) => {
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState);
  const rewardSettingsModalRef = useRef();

  const totalEmberCount = getTotalEmberCount(emberStats);

  return (
    <View style={styles.container}>
      <View style={styles.pageTitle}>
        <StyledH1 text={"Rewards"} style={styles.pageTitleText} />
        <FlameIcon height={37} width={37} style={styles.flameIcon} />
      </View>
      <View style={styles.inventorySection}>
        <StyledH2 text={"Embers in inventory: "} style={styles.pageTitleText} />
        <View style={styles.embersBox}>
          <StyledH2 text={totalEmberCount} style={styles.embersCostText} />
          <FlameIcon height={37} width={37} style={styles.flameIcon} />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          rewardSettingsModalRef?.current?.showAddRewardModal({});
        }}
      >
        <View style={styles.addRewardButton}>
          <StyledH3 text={"+ Add Reward"} />
        </View>
      </TouchableOpacity>

      {/* <ScrollView>
        <View style={styles.rewardItemsList}>
          <RewardItem title={"Watch a TV show"} embers_cost={20} canClaim={true} />
          <RewardItem title={"Watch a TV show"} embers_cost={20} canClaim={false} />
        </View>
      </ScrollView> */}

      <ScrollView>
        <View style={styles.rewardItemsList}>
          {rewardItems?.map((item, index) => (
            <RewardItem title={item.title} embers_cost={item.embers_cost} canClaim={true} key={index} />
          ))}
        </View>
      </ScrollView>
      <RewardSettingsModal ref={rewardSettingsModalRef} user={user} />
    </View>
  );
};

export default RewardsPage;

const getDynamicStyles = (ColorState) => ({
  embersCostText: {
    fontSize: 18,
    color: "black",
    textAlignVertical: "center",
    textAlign: "center",
    alignSelf: "center",
    marginLeft: 5,
  },
  embersBox: {
    flexDirection: "row",
    backgroundColor: ColorState?.Blue,
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 3,
    gap: 4,
    alignItem: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: ColorState?.DarkestBlue,
    paddingVertical: 60,
    gap: 10,
  },
  // reward items list
  rewardItemsList: {
    marginTop: 5,
    paddingHorizontal: 15,
    gap: 13,
  },
  // reward button
  addRewardButton: {
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: ColorState.DarkBlue,
    paddingVertical: 18,
    paddingHorizontal: 100,
    borderRadius: 20,
  },
  // inventory section
  inventorySection: {
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
  },
  // title section
  pageTitle: {
    flexDirection: "row",
    gap: 10,
    alignSelf: "center",
  },
  pageTitleText: {
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    justifyContent: "center",
  },
  flameIcon: {
    alignSelf: "center",
    justifyContent: "center",
  },
});

const testStyles = StyleSheet.create({
  test: {},
});
