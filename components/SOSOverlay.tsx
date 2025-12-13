import React, { useState, useEffect } from 'react';
import { Phone, AlertTriangle, X, Radio, User, Shield } from 'lucide-react';
import { useFacility } from '../contexts/FacilityContext';
import { PersonalContact } from '../types';
import { useIncident } from '../contexts/IncidentContext';
import { useAuth } from '../contexts/AuthContext';
import { useCall } from '../contexts/CallContext';

interface SOSOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  personalContacts: PersonalContact[];
}

const SOSOverlay: React.FC<SOSOverlayProps> = ({ isOpen, onClose, personalContacts }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const { reportIncident } = useIncident();
  const { user } = useAuth();
  const { facilities } = useFacility();
  const { initiateCall } = useCall();

  useEffect(() => {
    let timer: any;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      // Trigger the incident report
      handleSOS();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSOS = () => {
      if (!user) return;
      
      reportIncident({
          type: 'SOS Distress Signal',
          location: 'Current GPS Location (Simulated)',
          distance: '0.1 km',
          timeReported: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          caller: user.name,
          contact: user.email // Using email as contact for demo
      });

      setCountdown(null);
      onClose();
      // Optional: You might want to trigger a global toast here or let the user know success
      alert("Emergency Signal Broadcasted to Responders!");
  };

  const handleCallCommandCenter = () => {
      initiateCall('ADMIN');
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-600/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full flex flex-col p-6 text-white relative">
        <button 
          onClick={() => {
              setCountdown(null);
              onClose();
          }} 
          className="absolute top-6 right-6 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto scrollbar-hide">
          <div className="animate-pulse shrink-0 mt-8">
            <div className="w-24 h-24 rounded-full bg-white text-red-600 flex items-center justify-center shadow-2xl mb-4 mx-auto">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-wider">Emergency Mode</h2>
            <p className="text-red-100 mt-2">Location sharing enabled automatically</p>
          </div>

          <div className="w-full space-y-3 mt-8">
            
            {/* Personal Contacts Section */}
            {personalContacts.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-red-200 uppercase tracking-widest text-left">My Contacts</p>
                {personalContacts.map((contact) => (
                  <a 
                    key={contact.id}
                    href={`tel:${contact.number}`}
                    className="flex items-center justify-between bg-white text-red-700 p-4 rounded-xl shadow-lg active:scale-95 transition-transform border-l-8 border-red-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">{contact.name}</div>
                        <div className="text-xs opacity-75">{contact.relation}</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm">{contact.number}</span>
                  </a>
                ))}
              </div>
            )}

            <p className="text-sm font-medium text-red-200 uppercase tracking-widest text-left">Official Hotlines</p>
            
            {/* Command Center Hotline */}
            <button 
              onClick={handleCallCommandCenter}
              className="w-full flex items-center justify-between bg-yellow-50 text-yellow-900 p-4 rounded-xl shadow-lg active:scale-95 transition-transform border-l-8 border-yellow-500 mb-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-200 rounded-full">
                  <Shield className="w-5 h-5 text-yellow-800" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Command Center</div>
                  <div className="text-xs opacity-75">Staff & Admin Support</div>
                </div>
              </div>
              <span className="font-mono font-bold text-sm">CALL</span>
            </button>

            {facilities.map((contact) => (
              <a 
                key={contact.id}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between bg-white text-red-700 p-4 rounded-xl shadow-lg active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{contact.name}</div>
                    <div className="text-xs opacity-75">{contact.distance} • {contact.type}</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-lg">{contact.number}</span>
              </a>
            ))}
          </div>

          <button 
            onClick={() => setCountdown(5)}
            className="w-full bg-red-800 text-white p-6 rounded-2xl border-2 border-red-400 mt-4 flex items-center justify-center gap-3 shadow-xl active:bg-red-900 shrink-0"
          >
            {countdown !== null ? (
               <span className="text-2xl font-bold">Sending Alert in {countdown}...</span>
            ) : (
              <>
                 <Radio className="w-8 h-8 animate-pulse" />
                 <div className="text-left">
                    <div className="font-bold text-xl">BROADCAST DISTRESS</div>
                    <div className="text-xs text-red-300">Notifies all nearby responders</div>
                 </div>
              </>
            )}
           
          </button>
        </div>
        
        <div className="text-center text-xs text-red-200 opacity-60 mt-4 shrink-0 pb-4">
          False alarms are subject to penalties under local ordinances.
        </div>
      </div>
    </div>
  );
};

export default SOSOverlay;