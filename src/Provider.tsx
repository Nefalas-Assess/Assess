import React, { createContext, useCallback, useState } from 'react';

export const AppContext = createContext();

const initial = {
  expired: false,
  selected: null,
};

const AppProvider = ({ children }) => {
  const [data, setData] = useState(initial);

  const storeData = useCallback((res) => {
    setData((prev) => ({ ...prev, ...res }));
  }, []);

  const resetData = useCallback(() => {
    setData(initial);
  }, []);
  // the value passed in here will be accessible anywhere in our application
  // you can pass any value, in our case we pass our state and it's update method
  return (
    <AppContext.Provider value={{ data, setData: storeData, reset: resetData }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
