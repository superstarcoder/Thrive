import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import Color from '../assets/themes/Color'
import { StyledH2 } from './text/StyledText'
import { CaretUp, TextH } from 'phosphor-react-native';


// note:
// yet to implement feature in which parent can change scroll select's data state

// scroll select input
// use variable "value" to get the input's current value 
const ScrollSelect = ({dataArray, getScrollValue}) => {


  // helper function for rounding
  Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
  }

  // helper function for printing object data in readable way
  let getDataString = (myData) => {
    s = "[ "
    for (dataItem of myData) {
      s += dataItem.text+" "
    }
    s += "]"

    return s
  }


  let ls = []
    for (arrayItem of dataArray) {
      ls.push({text: arrayItem.toString(), id: arrayItem})
    }
  const [data, setData] = useState(ls)
  console.log("data updated: "+getDataString(data))

  const [textHeight, setTextHeight] = useState(28)
  const [value, setValue] = useState(data[0].text)

  let getHeight = (event) => {
    var {x, y, width, height} = event.nativeEvent.layout;
    console.log({x, y, width, height})
    setTextHeight(height)
  }

  // use below in order to print current value of scrollSelect
  useEffect(() => {
    console.log('current input value: ', value);
  }, [value]);

  const handleOnScroll = (event) => {
    let index = Math.round(((event.nativeEvent.contentOffset.y)/Math.round(textHeight)))
    if (index >= 0 && index < data.length) {
      let number = data[Math.round(index)].text
      setValue(number)
      getScrollValue(number)
    }
  }

  const handleOnMomentumScrollEnd = (event) => {
    let index = (event.nativeEvent.contentOffset.y)/Math.round(textHeight)
    let number = data[Math.round(index)].text

    setValue(number)
    getScrollValue(number)

    // below is useful. don't delete
    // console.log("scroll ended: "+event.nativeEvent.contentOffset.y)
    // console.log("unrounded index: "+index)
    // console.log("current number: "+ number)
  }



  return (
	<View style={styles.scrollSelectContainer}>
		<CaretUp size={5} />
		<View style={styles.scrollView}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({item}) => (
				  <StyledH2 text={item.text} style={{color: Color.DarkestBlue, flex: 1, alignSelf: "center"}} onLayout={getHeight}/>
        )}
        contentContainerStyle={styles.flatList}
        snapToInterval={Math.round(textHeight)}
        snapToAlignment="start"
        decelerationRate={"fast"}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
        onScroll={handleOnScroll}
        // contentOffset={{x:100, y:100}}
        ref={(ref) => this.flatListRef = ref}
      />
		</View>
		<CaretUp size={5} />
	</View>
  )
}

export default ScrollSelect

const styles = StyleSheet.create({
	scrollSelectContainer: {
		alignSelf: "flex-end",
	},
	scrollView: {
		backgroundColor: Color.White,
		borderRadius: 11,
		width: 45,
		height: 35,
		justifyContent: "center",
		alignItems: "center",
	},
  flatList: {
    // marginTop: 3,
    paddingVertical: 3.5
  }

})