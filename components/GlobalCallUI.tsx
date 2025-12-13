import React, { useEffect, useState } from 'react';
import { Phone, PhoneOff, Mic, VideoOff, User, FileText, X, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useCall } from '../contexts/CallContext';
import { useAuth } from '../contexts/AuthContext';
import { useIncident } from '../contexts/IncidentContext';

const GlobalCallUI: React.FC = () => {
  const { callState, answerCall, endCall } = useCall();
  const { user } = useAuth();
  const { reportIncident } = useIncident();
  const [duration, setDuration] = useState(0);

  // Emergency Report Form State
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    type: 'Medical Emergency',
    location: '',
    details: '',
  });
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    let timer: any;
    if (callState.status === 'CONNECTED' && callState.startTime) {
      timer = setInterval(() => {
        setDuration(Math.floor((Date.now() - callState.startTime!) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState.status, callState.startTime]);

  // Reset form when call ends
  useEffect(() => {
    if (!callState.isActive) {
        setShowReportForm(false);
        setReportSubmitted(false);
        setReportData({ type: 'Medical Emergency', location: '', details: '' });
    }
  }, [callState.isActive]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleDispatch = () => {
      if (!callState.caller) return;

      reportIncident({
          type: reportData.type,
          location: reportData.location || "Location reported via Call",
          distance: "Unknown", 
          timeReported: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          caller: callState.caller.name,
          contact: callState.caller.phone || callState.caller.email, 
      });
      
      setReportSubmitted(true);
      setTimeout(() => {
          setShowReportForm(false);
          setReportSubmitted(false);
          setReportData({ type: 'Medical Emergency', location: '', details: '' });
      }, 2000);
  };

  if (!user || !callState.isActive) return null;

  // Determine role in the call
  const isCaller = user.id === callState.caller?.id;
  
  // Can answer if user matches the recipient role
  const canAnswer = user.role === callState.recipientRole;

  // Determine if user is an official handling a call (Admin or Staff receiving a call)
  const isOfficialReceiver = !isCaller && (user.role === 'ADMIN' || user.role === 'STAFF') && callState.status === 'CONNECTED';

  // If this user is neither the caller nor the targeted recipient, don't show UI
  if (!isCaller && !canAnswer) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
      
      {/* Caller Info */}
      <div className={`flex flex-col items-center transition-all duration-300 ${showReportForm ? 'scale-75 mb-4' : 'mb-12'}`}>
        <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mb-6 border-4 border-slate-600 shadow-2xl relative">
             <User className="w-16 h-16 text-slate-400" />
             {callState.status === 'RINGING' && (
                 <div className="absolute inset-0 border-4 border-teal-500 rounded-full animate-ping opacity-75"></div>
             )}
        </div>
        
        <h2 className="text-3xl font-bold mb-2 text-center">
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

      {/* Report Form Overlay for Admin/Staff */}
      {showReportForm && (
        <div className="absolute inset-4 top-20 bottom-32 bg-white rounded-2xl p-4 text-slate-900 z-50 flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <h3 className="font-bold text-lg flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Emergency Report
                </h3>
                <button onClick={() => setShowReportForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {!reportSubmitted ? (
                <div className="flex-1 overflow-y-auto space-y-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Incident Type</label>
                        <select 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                            value={reportData.type}
                            onChange={e => setReportData({...reportData, type: e.target.value})}
                        >
                            <option>Medical Emergency</option>
                            <option>Fire Incident</option>
                            <option>Police Assistance</option>
                            <option>Traffic Accident</option>
                            <option>Natural Disaster</option>
                            <option>Other</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Location</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                            placeholder="e.g. Near Magellan's Cross..."
                            value={reportData.location}
                            onChange={e => setReportData({...reportData, location: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Details</label>
                        <textarea 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-red-500 focus:outline-none"
                            placeholder="Describe the situation..."
                            value={reportData.details}
                            onChange={e => setReportData({...reportData, details: e.target.value})}
                        />
                     </div>
                     <button 
                        onClick={handleDispatch}
                        className="w-full py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 mt-2 hover:bg-red-700 transition-colors"
                     >
                        <Send className="w-4 h-4" /> Dispatch to Responders
                     </button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-green-600 animate-in zoom-in">
                    <CheckCircle2 className="w-16 h-16 mb-4" />
                    <h4 className="text-xl font-bold">Report Sent!</h4>
                    <p className="text-gray-500 text-sm mt-2">Responders have been notified.</p>
                </div>
            )}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-8 absolute bottom-12">
        
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
             <div className="flex gap-6 items-center">
                <button className="p-4 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                    <Mic className="w-6 h-6" />
                </button>
                
                <button 
                    onClick={endCall}
                    className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 shadow-lg transition-colors scale-110"
                >
                    <PhoneOff className="w-8 h-8" />
                </button>
                
                {isOfficialReceiver ? (
                    <button 
                        onClick={() => setShowReportForm(true)}
                        className={`p-4 rounded-full transition-colors relative ${showReportForm ? 'bg-red-600 text-white' : 'bg-slate-800 text-red-400 hover:bg-slate-700 hover:text-red-300'}`}
                        title="Create Emergency Report"
                    >
                        <FileText className="w-6 h-6" />
                        {!showReportForm && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
                    </button>
                ) : (
                    <button className="p-4 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                        <VideoOff className="w-6 h-6" />
                    </button>
                )}
             </div>
        )}
      </div>
    </div>
  );
};
export default GlobalCallUI;