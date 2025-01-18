import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useColorsStateContext } from "../ColorContext";
import { StyledH1, StyledH2, StyledH3 } from "../text/StyledText";
import FlameIcon from "../../assets/flame_icon.svg";

const RewardsPage = () => {
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState);
  return (
    <View style={styles.container}>
      <View style={styles.pageTitle}>
        <StyledH1 text={"Rewards"} style={styles.pageTitleText} />
        <FlameIcon height={37} width={37} style={styles.flameIcon} />
      </View>
      <View style={styles.inventorySection}>
        <StyledH2 text={"Embers in inventory: "} style={styles.pageTitleText} />
        <FlameIcon height={37} width={37} style={styles.flameIcon} />
      </View>
      <TouchableOpacity>
        <View style={styles.addRewardButton}>
          <StyledH3 text={"+ Add Reward"}/>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RewardsPage;

const getDynamicStyles = (ColorState) => ({
  container: {
    flex: 1,
    backgroundColor: ColorState?.DarkestBlue,
    paddingVertical: 60,
    gap: 10,
  },
  // reward button
  addRewardButton: {
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: ColorState.DarkBlue,
    paddingVertical: 20,
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
