import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SafetyAlert } from '../types';
import { ACTIVE_ALERTS } from '../constants';

interface AdvisoryContextType {
  alerts: SafetyAlert[];
  addAlert: (alert: Omit<SafetyAlert, 'id' | 'timestamp'>) => void;
  removeAlert: (id: string) => void;
}

const AdvisoryContext = createContext<AdvisoryContextType | undefined>(undefined);

export const AdvisoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<SafetyAlert[]>(ACTIVE_ALERTS);

  const addAlert = (newAlert: Omit<SafetyAlert, 'id' | 'timestamp'>) => {
    const alert: SafetyAlert = {
      ...newAlert,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAlerts(prev => [alert, ...prev]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <AdvisoryContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AdvisoryContext.Provider>
  );
};

export const useAdvisory = () => {
  const context = useContext(AdvisoryContext);
  if (context === undefined) {
    throw new Error('useAdvisory must be used within an AdvisoryProvider');
  }
  return context;
};