import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Attraction } from '../types';
import { ATTRACTIONS as INITIAL_ATTRACTIONS } from '../constants';

interface AttractionContextType {
  attractions: Attraction[];
  addAttraction: (attraction: Attraction) => void;
  updateAttraction: (attraction: Attraction) => void;
}

const AttractionContext = createContext<AttractionContextType | undefined>(undefined);

export const AttractionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attractions, setAttractions] = useState<Attraction[]>(INITIAL_ATTRACTIONS);

  const addAttraction = (attraction: Attraction) => {
    setAttractions(prev => [attraction, ...prev]);
  };

  const updateAttraction = (updatedAttraction: Attraction) => {
    setAttractions(prev => prev.map(a => a.id === updatedAttraction.id ? updatedAttraction : a));
  };

  return (
    <AttractionContext.Provider value={{ attractions, addAttraction, updateAttraction }}>
      {children}
    </AttractionContext.Provider>
  );
};

export const useAttraction = () => {
  const context = useContext(AttractionContext);
  if (context === undefined) {
    throw new Error('useAttraction must be used within an AttractionProvider');
  }
  return context;
};