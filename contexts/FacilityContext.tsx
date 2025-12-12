import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EmergencyContact } from '../types';
import { EMERGENCY_CONTACTS as INITIAL_CONTACTS } from '../constants';

interface FacilityContextType {
  facilities: EmergencyContact[];
  addFacility: (facility: Omit<EmergencyContact, 'id'>) => void;
  removeFacility: (id: string) => void;
}

const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

export const FacilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [facilities, setFacilities] = useState<EmergencyContact[]>(INITIAL_CONTACTS);

  const addFacility = (facilityData: Omit<EmergencyContact, 'id'>) => {
    const newFacility: EmergencyContact = {
      ...facilityData,
      id: Date.now().toString(),
    };
    setFacilities(prev => [newFacility, ...prev]);
  };

  const removeFacility = (id: string) => {
    setFacilities(prev => prev.filter(f => f.id !== id));
  };

  return (
    <FacilityContext.Provider value={{ facilities, addFacility, removeFacility }}>
      {children}
    </FacilityContext.Provider>
  );
};

export const useFacility = () => {
  const context = useContext(FacilityContext);
  if (context === undefined) {
    throw new Error('useFacility must be used within a FacilityProvider');
  }
  return context;
};