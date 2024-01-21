import React from 'react';

const WPContext = React.createContext();

const WPContextProvider = ({ children }) => {
    const [globalState, setGlobalState] = useState(/* initial state here */);
  
    const updateGlobalState = (newState) => {
      setGlobalState(newState);
    };
    return (
        <WPContext.Provider value={{ globalState, updateGlobalState }}>
          {children}
        </WPContext.Provider>
      );
    };
    
    export { WPContextProvider, WPContext };
