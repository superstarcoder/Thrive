import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { Extrapolate, runOnJS, useAnimatedReaction, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { useColorsStateContext } from '../ColorContext';

const SliderBar = forwardRef(({ getSliderPercent, onSliderMoveEnd }, sliderBarRef) => {

  const translateX = useSharedValue(0)
  const context = useSharedValue({ x: 0 })
  const MAX_TRANSLATE_X = 200 - 29
  const sliderPercent = useSharedValue(0)
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)

  const sliderBarGesture = Gesture.Tap().maxDuration(250)
    .onStart((event) => {
      translateX.value = event.x
      translateX.value = Math.min(translateX.value, MAX_TRANSLATE_X)
      translateX.value = Math.max(0, translateX.value)
      sliderPercent.value = translateX.value / MAX_TRANSLATE_X
      runOnJS(getSliderPercent)(sliderPercent.value)
    }).onEnd(() => {
      runOnJS(onSliderMoveEnd)(sliderPercent.value)
    })

  const setSliderTo = useCallback((percent) => {
    "worklet"

    translateX.value = percent * MAX_TRANSLATE_X

  }, [])

  useImperativeHandle(sliderBarRef, () => ({ setSliderTo }), [
    setSliderTo
  ])

  // why use context?
  // basically, the animation always starts from the beginning rather than the same position
  // so to make the animation start from the same position,
  // we translate the view to where it's supposed to start from + where it's supposed to go


  // important thing to note:
  // event.translationX = how much the finger moves
  // translateX.value = x position relative to starting position
  const sliderCircleGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value }
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x
      translateX.value = Math.min(translateX.value, MAX_TRANSLATE_X)
      translateX.value = Math.max(0, translateX.value)
      sliderPercent.value = translateX.value / MAX_TRANSLATE_X
      runOnJS(getSliderPercent)(sliderPercent.value)
      // don't delete:
      // console.log("x: "+event.absoluteX)
      // console.log("translationX: "+event.translationX)
      // console.log("translateXValue: "+translateX.value)
      // console.log("slider percent: "+ translateX.value/MAX_TRANSLATE_X)
    })
    .onEnd(() => {
      runOnJS(onSliderMoveEnd)(sliderPercent.value)
    });

  const sliderCircleStyle = useAnimatedStyle(() => {

    var backgroundColor;
    const myImportanceNum = parseFloat(((translateX.value / MAX_TRANSLATE_X) * 10).toFixed(1))

    if (myImportanceNum <= 4) {
      backgroundColor = "#153816"
    }
    else if (myImportanceNum <= 7) {
      backgroundColor = "#00224d"
    }
    else {
      backgroundColor = "#610505"
    }

    return {
      transform: [{ translateX: translateX.value }],
      backgroundColor: backgroundColor,
    }
  })

  const sliderBarFilledStyle = useAnimatedStyle(() => {

    var backgroundColor;
    const myImportanceNum = parseFloat(((translateX.value / MAX_TRANSLATE_X) * 10).toFixed(1))

    if (myImportanceNum <= 4) {
      backgroundColor = ColorState?.GreenAccent
    }
    else if (myImportanceNum <= 7) {
      backgroundColor = ColorState?.BlueAccent
    }
    else {
      backgroundColor = ColorState?.RedAccent
    }

    return {
      width: translateX.value + 29,
      backgroundColor: backgroundColor,
    }
  })

  return (
    <GestureDetector gesture={sliderBarGesture}>
      <Animated.View style={styles.sliderBar}>
        <Animated.View style={[styles.sliderBarFilled, sliderBarFilledStyle]}>

          <GestureDetector gesture={sliderCircleGesture}>
            <Animated.View style={[styles.sliderCircle, sliderCircleStyle]}>
            </Animated.View>
          </GestureDetector>

        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
})

export default SliderBar


const getDynamicStyles = (ColorState) => ({
  sliderContainer: {
  },
  sliderBar: {
    height: 29,
    width: 200,
    backgroundColor: ColorState?.DarkGray,
    marginTop: 12,
    marginBottom: 10,
    borderRadius: 30,
  },
  sliderBarFilled: {
    height: 29,
    width: 50,
    backgroundColor: ColorState?.StreaksBar,
    borderRadius: 30,
  },
  sliderCircle: {
    height: 29,
    width: 29,
    backgroundColor: ColorState?.DarkBlue,
    borderRadius: 30,
  }
});