import React, { useEffect, useState } from 'react';
import { Phone, PhoneOff, Mic, VideoOff, User } from 'lucide-react';
import { useCall } from '../contexts/CallContext';
import { useAuth } from '../contexts/AuthContext';

const GlobalCallUI: React.FC = () => {
  const { callState, answerCall, endCall } = useCall();
  const { user } = useAuth();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let timer: any;
    if (callState.status === 'CONNECTED' && callState.startTime) {
      timer = setInterval(() => {
        setDuration(Math.floor((Date.now() - callState.startTime!) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState.status, callState.startTime]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (!user || !callState.isActive) return null;

  // Determine role in the call
  const isCaller = user.id === callState.caller?.id;
  
  // Can answer if user matches the recipient role
  // Logic: If recipient is ADMIN, only ADMIN can answer. If STAFF, only STAFF.
  const canAnswer = user.role === callState.recipientRole;

  // If this user is neither the caller nor the targeted recipient, don't show UI
  if (!isCaller && !canAnswer) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
      
      {/* Caller Info */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mb-6 border-4 border-slate-600 shadow-2xl relative">
             <User className="w-16 h-16 text-slate-400" />
             {callState.status === 'RINGING' && (
                 <div className="absolute inset-0 border-4 border-teal-500 rounded-full animate-ping opacity-75"></div>
             )}
        </div>
        
        <h2 className="text-3xl font-bold mb-2">
            {isCaller 
                ? (callState.status === 'CONNECTED' ? `Speaking with ${callState.recipientRole}` : `Calling ${callState.recipientRole}...`)
                : (callState.status === 'CONNECTED' ? `In call with ${callState.caller?.name}` : `${callState.caller?.name} is calling...`)
            }
        </h2>
        
        <p className="text-slate-400 text-lg">
            {callState.status === 'RINGING' && (isCaller ? 'Waiting for answer...' : 'Incoming Secure Call')}
            {callState.status === 'CONNECTED' && formatTime(duration)}
            {callState.status === 'ENDED' && 'Call Ended'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        
        {/* Actions for Incoming Call (Recipient) */}
        {!isCaller && callState.status === 'RINGING' && (
            <>
                 <button 
                    onClick={endCall}
                    className="flex flex-col items-center gap-2 group"
                >
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-700 transition-colors">
                        <PhoneOff className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-medium">Decline</span>
                </button>

                <button 
                    onClick={answerCall}
                    className="flex flex-col items-center gap-2 group"
                >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:bg-green-600 transition-colors animate-bounce">
                        <Phone className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-medium">Accept</span>
                </button>
            </>
        )}

        {/* Actions for Active/Dialing Call */}
        {(isCaller || callState.status === 'CONNECTED') && callState.status !== 'ENDED' && (
             <div className="flex gap-6">
                <button className="p-4 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                    <Mic className="w-6 h-6" />
                </button>
                <button 
                    onClick={endCall}
                    className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 shadow-lg transition-colors scale-110"
                >
                    <PhoneOff className="w-8 h-8" />
                </button>
                <button className="p-4 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                    <VideoOff className="w-6 h-6" />
                </button>
             </div>
        )}
      </div>
    </div>
  );
};
export default GlobalCallUI;