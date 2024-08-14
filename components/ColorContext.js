// StateContext.js
import React, { createContext, useState, useContext } from 'react';
import {thriveBlueTheme, deepPurpleTheme} from "../assets/themes/ThemeColors"

const ColorsStateContext = createContext();

export const ColorsStateProvider = ({ children }) => {
  // set default theme to thrive blue; Note: this may be overridden afterwards based on UserSettings data
  const [ColorState, setColorState] = useState(thriveBlueTheme);

  return (
    <ColorsStateContext.Provider value={{ ColorState, setColorState }}>
      {children}
    </ColorsStateContext.Provider>
  );
};

export const useColorsStateContext = () => useContext(ColorsStateContext);