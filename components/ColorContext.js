// StateContext.js
import React, { createContext, useState, useContext } from 'react';
import {thriveBlueTheme, deepPurpleTheme} from "../assets/themes/ThemeColors"

const ColorsStateContext = createContext();

export const ColorsStateProvider = ({ children }) => {
  const [ColorState, setColorState] = useState(deepPurpleTheme);

  return (
    <ColorsStateContext.Provider value={{ ColorState, setColorState }}>
      {children}
    </ColorsStateContext.Provider>
  );
};

export const useColorsStateContext = () => useContext(ColorsStateContext);