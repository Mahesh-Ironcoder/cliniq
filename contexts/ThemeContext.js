import React, {useState, createContext} from 'react';

export const themeContext = createContext(null);

const ThemeContextProvider = (props) => {
  const [theme, setTheme] = useState({mode: 'light'});

  const toggleTheme = () => {
    setTheme({...theme, mode: theme.mode === 'dark' ? 'light' : 'dark'});
  };

  return (
    <themeContext.Provider value={{...theme, toggleTheme}}>
      {props.children}
    </themeContext.Provider>
  );
};

export default ThemeContextProvider;
