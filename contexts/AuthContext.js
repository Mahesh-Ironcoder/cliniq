import React, {useState, createContext} from 'react';

export const authContext = createContext(null);

const AuthContextProvider = (props) => {
  const [authentication, setAuthentication] = useState({status: false});

  const login = (creds) => {
    /** Verify the creds with server and get a token
     * token = fetchTokenFromServer()
     * store the token in the secure storage for accessing and create a session
     */
    const token = 'dummy-user-token';
    if (token !== null) {
      setAuthentication({...authentication, status: true});
    }
  };

  const logout = () => {
    /** Logout the current user and clear all the session related to that user */
    setAuthentication({...authentication, status: false});
  };

  return (
    <authContext.Provider value={{...authentication, login: login, logout}}>
      {props.children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
