import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { useAuth } from './AuthContext';

interface CallState {
  isActive: boolean;
  status: 'IDLE' | 'RINGING' | 'CONNECTED' | 'ENDED';
  caller: User | null;
  recipientRole: UserRole | null;
  startTime: number | null;
}

interface CallContextType {
  callState: CallState;
  initiateCall: (recipientRole: UserRole) => void;
  answerCall: () => void;
  endCall: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    status: 'IDLE',
    caller: null,
    recipientRole: null,
    startTime: null
  });

  const initiateCall = (recipientRole: UserRole) => {
    if (!user) return;
    setCallState({
      isActive: true,
      status: 'RINGING',
      caller: user,
      recipientRole: recipientRole,
      startTime: null
    });
  };

  const answerCall = () => {
    setCallState(prev => ({
      ...prev,
      status: 'CONNECTED',
      startTime: Date.now()
    }));
  };

  const endCall = () => {
    setCallState(prev => ({ ...prev, status: 'ENDED' }));
    setTimeout(() => {
       setCallState({
          isActive: false,
          status: 'IDLE',
          caller: null,
          recipientRole: null,
          startTime: null
       });
    }, 2000);
  };

  return (
    <CallContext.Provider value={{ callState, initiateCall, answerCall, endCall }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};