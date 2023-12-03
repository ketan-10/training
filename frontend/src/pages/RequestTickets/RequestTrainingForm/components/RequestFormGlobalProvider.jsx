import { createContext, useContext, useState } from 'react';

export const RequestFormGlobalState = createContext({});

export function RequestFormGlobalProvider({ formDefaults, children }) {
  const value = useState(formDefaults || {});
  return (
    <RequestFormGlobalState.Provider value={value}>
      {children}
    </RequestFormGlobalState.Provider>
  );
}

export function useRequestFormGlobal() {
  const context = useContext(RequestFormGlobalState);
  if (!context) {
    throw new Error('useAppState must be used within the AppProvider');
  }
  return context;
}
