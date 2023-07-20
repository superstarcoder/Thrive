import { StyleSheet, View, Text, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useImperativeHandle } from 'react'
import Color from '../assets/themes/Color'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

const {height: SCREEN_HEIGHT} = Dimensions.get("window")
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50

const BottomSheet = React.forwardRef (({children, includeLine=true, customStyle, clamps=[0, 0.6, 1]}, bottomSheetRef) => {

  const translateY = useSharedValue(0)
  const active = useSharedValue(false)
  const context = useSharedValue({y: 0})

  const scrollTo = useCallback((percent) => {
    "worklet"

    if (percent === 0) {
      active.value = false
    }
    else {
      active.value = true
    }

    translateY.value = withSpring(percent*MAX_TRANSLATE_Y, {damping: 15})

  }, [])


  const isActive = useCallback(() => {
    return active.value;
  }, [])

  // 2nd arg: return object with scrollTo
  // 3rd arg: return dependencies
  useImperativeHandle(bottomSheetRef, () => ({scrollTo, isActive}), [
    scrollTo,
    isActive])

  // useEffect(() => {
  //   scrollTo(0.3)
  // }, [])

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value}
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y)
    })
    .onEnd(() => {
      
      let distanceFromClamp = []
      for (const clamp of clamps) {
        distanceFromClamp.push((Math.abs(translateY.value-MAX_TRANSLATE_Y*clamp)))
      }
      let indexOfClamp = distanceFromClamp.indexOf(Math.min(...distanceFromClamp))
      let clampTo = clamps[indexOfClamp]
      scrollTo(clampTo)

      // if (translateY.value > -SCREEN_HEIGHT/3) {
      //   scrollTo(0)
      // }
      // else if (translateY.value < -SCREEN_HEIGHT/1.2) {
      //   scrollTo(1)
      // }
    })

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
      )
    return {
      borderRadius,
      transform: [{translateY: translateY.value}]
    }
  })


  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, customStyle, rBottomSheetStyle]}>
        {includeLine &&
          <View style={styles.line} />
        }
        {children}
      </Animated.View>
    </GestureDetector>
  )
})

export default BottomSheet

const styles = StyleSheet.create({
	bottomSheetContainer: {
		height: SCREEN_HEIGHT,
		width: '100%',
		position: 'absolute',
		top: SCREEN_HEIGHT,
		borderRadius: 25,
	},
	line: {
		width: 75,
		height: 4,
		backgroundColor: "gray",
		alignSelf: "center",
		marginVertical: 20,
		borderRadius: 2,

	}
})