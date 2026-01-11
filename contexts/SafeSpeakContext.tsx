import React, { ReactNode, createContext, useContext, useState } from 'react';

export type SafeSpeakStatus = 'idle' | 'active' | 'has_used_features';

interface SafeSpeakContextType {
  status: SafeSpeakStatus;
  setStatus: (status: SafeSpeakStatus) => void;
}

const SafeSpeakContext = createContext<SafeSpeakContextType | undefined>(undefined);

export const useSafeSpeak = () => {
  const context = useContext(SafeSpeakContext);
  if (context === undefined) {
    throw new Error('useSafeSpeak must be used within a SafeSpeakProvider');
  }
  return context;
};

interface SafeSpeakProviderProps {
  children: ReactNode;
}

export const SafeSpeakProvider: React.FC<SafeSpeakProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<SafeSpeakStatus>('idle');

  return (
    <SafeSpeakContext.Provider value={{ status, setStatus }}>
      {children}
    </SafeSpeakContext.Provider>
  );
};
