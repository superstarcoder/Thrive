import { Check, Eye } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Color from '../../assets/themes/Color';
import { fontStyles } from '../text/StyledText';

/**
 * Note: This component uses https://www.npmjs.com/package/react-native-select-dropdown
 * @param {ReactComponent} buttonComponent button component that gets rendered, and when clicked opens up the dropdown 
 * @param {dropDownOptions} dropDownOptions list of names of dropdown options
 * @param {string} defaultValue default value for select
 * @param {function} onSelect function that gets updated when a new option is selected
 * @param {string} position either "left" or "right"
 * @param {boolean} hasHeading "true" if there is an unclickable heading in the dropdown; false if not
 * @returns 
 */
const DropDown = ({ buttonComponent, dropDownOptions, onSelect, defaultValue, sortButtonRef, position = "right", hasHeading = false, headingIndex = null, headingComponent = null }) => {

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
        disabledIndexes={[headingIndex]}
        ref={sortButtonRef}
        renderButton={(selectedItem, isOpen) => {
          return buttonComponent;
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View>

              {index == headingIndex ? (
                <>
                  {headingComponent}
                </>
              ) : (
                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: Color.GrayBlue }), }}>
                  <Text style={
                    {
                      ...fontStyles.styledH4,
                      ...styles.dropdownItemTxtStyle,
                      ...(isSelected && { color: Color.TextColor }),
                    }

                  }>{item}</Text>

                  {(isSelected) &&
                    <Check size={20} color={Color.Gray} />
                  }
                </View>
              )

              }

            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={{ ...styles.dropdownMenuStyle, ...dynamicMarginStyle }}
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
    backgroundColor: Color.Gray,
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