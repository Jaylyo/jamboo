import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Incident } from '../types';

interface IncidentContextType {
  incidents: Incident[];
  reportIncident: (incident: Omit<Incident, 'id' | 'status'>) => void;
  resolveIncident: (id: string) => void;
  assignResponder: (id: string) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial Mock Data
  const [incidents, setIncidents] = useState<Incident[]>([
    {
        id: 'INC-MOCK-1',
        type: 'Medical Emergency',
        location: 'Kawasan Falls, Badian',
        distance: '2.4 km',
        timeReported: '10:42 AM',
        caller: 'Maria Santos',
        contact: '0917-123-4567',
        status: 'IN_PROGRESS'
    }
  ]);

  const reportIncident = (newIncidentData: Omit<Incident, 'id' | 'status'>) => {
    const newIncident: Incident = {
      ...newIncidentData,
      id: `SOS-${Date.now()}`,
      status: 'PENDING'
    };
    // Add new incident to the TOP of the list
    setIncidents(prev => [newIncident, ...prev]);
  };

  const resolveIncident = (id: string) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, status: 'RESOLVED' } : inc
    ));
  };

  const assignResponder = (id: string) => {
     setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, status: 'IN_PROGRESS' } : inc
    ));
  };

  return (
    <IncidentContext.Provider value={{ incidents, reportIncident, resolveIncident, assignResponder }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};