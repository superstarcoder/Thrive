import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import Color from '../assets/themes/Color'
import { StyledH2 } from './text/StyledText'
import { CaretUp, TextH } from 'phosphor-react-native';

// scroll select input
// use variable "value" to get the input's current value 
const ScrollSelect = () => {

  Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
  }

  let lsBeginning = ["0", "0.2", "0.5", "0.8"]
  let ls = []

  for (item of lsBeginning) {
    ls.push({text: item, id: item})
  }

  for (let i = 1; i < 9; i += 0.5) {
    ls.push({text: (i.round(2)).toString(), id: i.round(2)})
  }
  
  const [data, setData] = useState(ls)
  const [textHeight, setTextHeight] = useState(28)
  const [value, setValue] = useState(data[0].text)

  const scrollRef = useRef(null);
  const heightRef = useRef(null);

  let getHeight = (event) => {
    var {x, y, width, height} = event.nativeEvent.layout;
    console.log({x, y, width, height})
    setTextHeight(height)
  }

  // use below in order to print current value of scrollSelect
  // useEffect(() => {
  //   console.log('current input value: ', value);
  // }, [value]);

  const handleOnMomentumScrollEnd = (event) => {
    let index = (event.nativeEvent.contentOffset.y)/Math.round(textHeight)
    let number = Number(data[Math.round(index)].text)

    setValue(number)

    // below is useful. don't delete
    // console.log("scroll ended: "+event.nativeEvent.contentOffset.y)
    // console.log("unrounded index: "+index)
    // console.log("current number: "+ number)
  }

  // helper function for printing state data in readable way
  let getDataString = (myData) => {
    s = "[ "
    for (dataItem of myData) {
      s += dataItem.text+" "
    }
    s += "]"

    return s
  }

  return (
	<View style={styles.scrollSelectContainer}>
		<CaretUp size={5} />
		<View style={styles.scrollView}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({item}) => (
				  <StyledH2 text={item.text} style={{color: Color.DarkestBlue, flex: 1}} onLayout={getHeight}/>
        )}
        contentContainerStyle={styles.flatList}
        snapToInterval={Math.round(textHeight)}
        snapToAlignment="start"
        decelerationRate={"fast"}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
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