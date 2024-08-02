import { Check, Eye } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Color from '../../assets/themes/Color';
import { fontStyles } from '../text/StyledText';
import { ActivityIndicator } from 'react-native-web';

/**
 * 
 * @param {ReactComponent} buttonComponent button component that gets rendered, and when clicked opens up the dropdown 
 * @param {dropDownOptions} dropDownOptions list of names of dropdown options
 * @param {string} defaultValue default value for select
 * @param {function} onSelect function that gets updated when a new option is selected
 * @param {string} position either "left" or "right"
 * @returns 
 */
const DropDown = ({ buttonComponent, dropDownOptions, onSelect, defaultValue, position="right", isLoading, loadingItemIndex }) => {

  let dynamicMarginStyle
  if (position == "left") {
    dynamicMarginStyle = {
      marginLeft: -165
    }
  } else if (position == "right") {
    dynamicMarginStyle = {}
  }

  return (
    <View style={styles.container}>
      <SelectDropdown
        defaultValue={defaultValue}
        data={dropDownOptions}
        onSelect={onSelect}
        renderButton={(selectedItem, isOpen) => {
          return buttonComponent;
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View>

              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: Color.GrayBlue }),
                }}>
                <Text style={

                  {
                    ...fontStyles.styledH4,
                    ...styles.dropdownItemTxtStyle,
                    ...(isSelected && { color: "gray" }),
                  }

                }>{item}</Text>
                {/* {(isLoading && (loadingItemIndex == index)) &&
                  <ActivityIndicator size="small" color={Color.DarkestBlue} />
                } */}
                {(isSelected) &&
                  <Check size={20} color='gray' />
                }
              </View>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={{...styles.dropdownMenuStyle, ...dynamicMarginStyle}}
      />
    </View >
  );
};

export default DropDown;

const styles = StyleSheet.create({
  viewButton: {
    backgroundColor: Color.DarkBlue,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    borderRadius: 8,
    width: 200,
    // marginLeft: -165
  },
  dropdownItemStyle: {
    backgroundColor: '#818181',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 0.5,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    color: 'black',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});