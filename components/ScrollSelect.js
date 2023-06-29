import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import Color from '../assets/themes/Color'
import { StyledH2 } from './text/StyledText'
import { CaretUp } from 'phosphor-react-native';


const ScrollSelect = () => {

  Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
  }

  let ls = []
  for (let i = 0; i < 10; i += 0.1) {
    ls.push({text: (i.round(2)).toString(), id: i.round(2)})
  }
  const [data, setData] = useState(ls)


  const scrollRef = useRef(null);
  const heightRef = useRef(null);


  useEffect(() => {
    // ref.current.flashScrollIndicators();
  })

  useLayoutEffect(() => {
    // console.log(heightRef?.current?.clientHeight)
  })

  let getHeight = (event) => {
    var {x, y, width, height} = event.nativeEvent.layout;
    // console.log({x, y, width, height})
  }

  let handleOnScrollEnd = (event) => {
    console.log("scroll ended: "+event.nativeEvent.contentOffset.y)
    newData = [...data] // copy old array
    newData.push(newData.shift())
    setData(newData)
    console.log("data start: "+data[0].text)
    console.log("data end: "+data[data.length-1].text)

      // this.flatListRef.scrollTo({
      //   y: event.nativeEvent.contentOffset.y-28,
      //   animated: false,
      // })

      // use scrollToIndex()

    // scrollRef.current?.scrollTo({
    //   y: event.nativeEvent.contentOffset.y-28,
    //   animated: false,
    // });
  }

  let onScroll = (event) => {
    console.log("scrolling: "+event.nativeEvent.contentOffset.y)
  }

// const onLayout = () => {
//     ref.current?.scrollToIndex({
//         index: 10,
//         viewPosition: 0.5,
//     });
// };



// 0
// 1
// 2
// 3
// 4

// 0
// 1
// TWO
// 3
// 4

// 1
// TWO
// 3
// 4
// 0


  return (
	<View style={styles.scrollSelectContainer}>
		<CaretUp size={5} />
		<View style={styles.scrollView}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({item}) => (
				  <StyledH2 text={item.text} style={{color: Color.Gray, flex: 1}} ref={heightRef} onLayout={getHeight}/>
        )}
        contentContainerStyle={styles.flatList}
        snapToInterval={28}
        snapToAlignment="start"
        decelerationRate={"fast"}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={handleOnScrollEnd}
        // onMomentumScrollEnd={handleOnScrollEnd}
        // contentOffset={{x:100, y:100}}
        ref={(ref) => this.flatListRef = ref}
      />
{/*       
			<FlatList snapToInterval={35} >
				<StyledH2 text={"2.4"} style={{color: Color.Gray}}/>
				<StyledH2 text={"2.5"} style={{color: Color.Gray}}/>
				<StyledH2 text={"2.5"} style={{color: Color.Gray}}/>
				<StyledH2 text={"2.5"} style={{color: Color.Gray}}/>
				<StyledH2 text={"2.5"} style={{color: Color.Gray}}/>
				<StyledH2 text={"2.5"} style={{color: Color.Gray}}/>
				<StyledH2 text={"2.5"} style={{color: Color.Gray}}/>
				<StyledH2 text={"2.5"} style={{color: Color.Gray}}/>
			</FlatList> */}
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
    marginTop: 3,

  }

})