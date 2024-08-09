import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
import { useFonts } from 'expo-font'
import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { Clock, Pencil, PencilSimple, PencilSimpleLine } from 'phosphor-react-native';
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts } from '../../text/StyledText';
// import ScrollSelect from '../../FormComponents/ScrollSelect';
import ScrollSelect from '../../FormComponents/ScrollSelect';
import { useColorsStateContext } from '../../ColorContext';

const DurationBox = forwardRef(({ dispatch, duration }, ref) => {

  var dataArray = [0, 0.1, 0.2, 0.5, 0.8]

  for (let i = 1; i < 9; i += 0.5) {
    dataArray.push(i)
  }

  const [selectedIndex, setSelectedIndex] = useState(dataArray.indexOf(duration));
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)


  const scrollSelectRef = useRef()

  useImperativeHandle(ref, () => ({

    setDuration(duration) {
      const index = dataArray.indexOf(duration)
      if (index == -1) {
        console.error("DurationBox.js: setDuration: duration not in list of possible durations")
      }
      // console.log(index, duration, dataArray)
      scrollSelectRef?.current?.scrollToIndex(index)

      setSelectedIndex(dataArray.indexOf(duration))
    }

  }));

  var [fontsLoaded] = useFonts({
    "MPlus": require("../../../assets/fonts/mplusRegular.ttf")
  })
  if (!fontsLoaded) {
    return null
  }

  // console.log("dataArray: "+dataArray)

  return (
    <View style={styles.inputBox}>
      <View style={styles.inputBoxLeft}>
        <Text style={styles.boxTitleContainer}>
          <StyledH2 text={"Duration "} style={{ color: ColorState?.TextColorOnBg }} />
          <StyledH4 text={"(estimate)"} style={{ color: ColorState?.GrayOnBg }} />
        </Text>
        <View style={styles.timeText}>
          <Clock size={20} weight="fill" color={ColorState?.RedAccent} style={styles.clockIcon} />
          {/* <View style={styles.durationContainer}> */}
          <StyledH4 text={dataArray[selectedIndex] + " hours "} style={styles.durationText} />
          {/* </View> */}
          {/* <View style={styles.editButton}>
            <Pencil size={25} weight="regular" color={"black"} style={styles.buttonIcon} />
          </View> */}
        </View>
      </View>
      <View style={styles.inputBoxRight}>
        <ScrollSelect dispatch={dispatch} dataArray={dataArray} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
        {/* <ScrollSelect dataArray={dataArray} dispatch={dispatch} duration={duration} ref={scrollSelectRef} /> */}
      </View >
    </View>
  )
});

export default DurationBox


const getDynamicStyles = (ColorState) => ({
  inputBox: {
    backgroundColor: ColorState?.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 35,
    flexDirection: "row",
    marginBottom: 22,
  },
  durationContainer: {
    backgroundColor: ColorState?.DarkBlue,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  durationText: {
    color: ColorState?.TextColorOnBg,
    textAlign: "center"
  },
  editButton: {
    marginLeft: 10,
    backgroundColor: ColorState?.LightBlue,
    padding: 3,
    borderRadius: 10,
    flexDirection: "row",
  },
  editButtonText: {
    color: "black"
  },
  inputBoxLeft: {

  },
  inputBoxRight: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    right: "10%",
    paddingRight: 10
  },

  clockIcon: {
    marginRight: 7,
  },
  timeText: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  boxTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 7,
  }
});