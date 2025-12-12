import React, { useState } from 'react';
import { Radio, MapPin, CheckCircle, Navigation, Phone, LogOut, Siren, Clock, User, ChevronRight, Shield, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIncident } from '../contexts/IncidentContext';
import { Incident } from '../types';

const ResponderDashboard: React.FC = () => {
  const { logout, user, switchRole } = useAuth();
  const { incidents, resolveIncident, assignResponder } = useIncident();
  const [isOnline, setIsOnline] = useState(true);
  const [view, setView] = useState<'ACTIVE' | 'LOGS' | 'PROFILE'>('ACTIVE');
  
  // Find the first active incident or null if none
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // If no specific incident is selected, but there are active ones, select the first one automatically
  // or handle selection manually. For now, let's default to the first one if not set.
  const currentIncident = selectedIncidentId 
    ? incidents.find(i => i.id === selectedIncidentId) 
    : (activeIncidents.length > 0 ? activeIncidents[0] : null);

  const handleResolve = () => {
    if (currentIncident) {
        resolveIncident(currentIncident.id);
        setSelectedIncidentId(null);
    }
  };

  const handleNavigate = () => {
    if (!currentIncident) return;
    
    let url = '';
    // Check if coordinates exist (simulated check as mock data might not have them)
    if (currentIncident.coordinates) {
        url = `https://www.google.com/maps/search/?api=1&query=${currentIncident.coordinates.lat},${currentIncident.coordinates.lng}`;
    } else {
        // Fallback to searching by location name. 
        // Removing "(Simulated)" text if present for cleaner search
        const locationQuery = currentIncident.location.replace('(Simulated)', '').trim();
        const query = encodeURIComponent(`${locationQuery}, Cebu`);
        url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="p-4 bg-red-700 text-white shadow-md flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Siren className="w-5 h-5 animate-pulse" />
            Responder Unit
          </h1>
          <p className="text-xs text-red-100 opacity-80">Officer: {user?.name}</p>
        </div>
        <button onClick={logout} className="p-2 bg-red-800 rounded-full hover:bg-red-900">
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      {/* Status Toggle & Nav */}
      <div className="bg-white shadow-sm">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <span className="text-sm font-bold text-gray-700">Status</span>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                isOnline ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              {isOnline ? 'ON DUTY' : 'OFF DUTY'}
            </button>
          </div>
          <div className="flex">
              <button onClick={() => setView('ACTIVE')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${view === 'ACTIVE' ? 'border-red-600 text-red-700' : 'border-transparent text-gray-500'}`}>
                  Active ({activeIncidents.length})
              </button>
              <button onClick={() => setView('LOGS')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${view === 'LOGS' ? 'border-red-600 text-red-700' : 'border-transparent text-gray-500'}`}>Incident Log</button>
              <button onClick={() => setView('PROFILE')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${view === 'PROFILE' ? 'border-red-600 text-red-700' : 'border-transparent text-gray-500'}`}>Profile</button>
          </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {view === 'ACTIVE' && (
            <>
                {activeIncidents.length > 1 && !selectedIncidentId && (
                    <div className="mb-4 space-y-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase">Incoming Alerts</h3>
                        {activeIncidents.map(inc => (
                             <button 
                                key={inc.id}
                                onClick={() => setSelectedIncidentId(inc.id)}
                                className="w-full bg-white p-3 rounded-xl border border-red-100 shadow-sm flex justify-between items-center hover:bg-red-50"
                             >
                                <div className="text-left">
                                    <div className="font-bold text-sm text-red-700">{inc.type}</div>
                                    <div className="text-xs text-gray-500">{inc.location}</div>
                                </div>
                                <span className="text-xs font-mono text-gray-400">{inc.timeReported}</span>
                             </button>
                        ))}
                    </div>
                )}

                {/* Active Incident Card */}
                {currentIncident ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl shadow-lg border-l-8 border-red-600 overflow-hidden animate-in slide-in-from-bottom-5">
                      <div className="bg-red-50 p-3 border-b border-red-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                          <Radio className="w-3 h-3 animate-pulse" /> Priority Alert
                        </span>
                        <span className="text-xs font-mono text-red-800">{currentIncident.timeReported}</span>
                      </div>
                      
                      <div className="p-5">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{currentIncident.type}</h2>
                        <div className="flex items-center text-gray-600 mb-4 text-sm">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {currentIncident.location}
                        </div>

                        {/* Detailed Information Grid */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Report Details</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Caller Name</div>
                                        <div className="font-bold text-gray-800 text-sm">{currentIncident.caller}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-green-500">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Contact Number</div>
                                        <div className="font-bold text-gray-800 text-lg font-mono">{currentIncident.contact}</div>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-500">
                                        <Navigation className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Est. Distance</div>
                                        <div className="font-bold text-gray-800 text-sm">{currentIncident.distance || 'Unknown'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={handleNavigate}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 shadow-sm"
                          >
                             <Navigation className="w-4 h-4" />
                             Navigate
                          </button>
                          <a href={`tel:${currentIncident.contact}`} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-sm">
                             <Phone className="w-4 h-4" />
                             Call Now
                          </a>
                        </div>

                        <button 
                          onClick={handleResolve}
                          className="w-full mt-3 py-3 border border-gray-200 text-gray-500 font-medium rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Resolved
                        </button>
                      </div>
                    </div>

                    {/* Integrated Map View */}
                    <div className="bg-slate-200 h-64 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner border border-slate-300">
                        {/* Map Grid Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                        
                        {/* Map Pin */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-red-500/20 rounded-full animate-ping"></div>
                                <MapPin className="w-10 h-10 text-red-600 relative z-10 drop-shadow-md" />
                            </div>
                        </div>

                        {/* Location Label */}
                        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span className="text-xs font-bold text-gray-800 truncate">{currentIncident.location}</span>
                            </div>
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">GPS: Active</span>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
                    <CheckCircle className="w-12 h-12 mb-2 text-green-500 opacity-50" />
                    <p>All clear. No active incidents.</p>
                  </div>
                )}
            </>
        )}

        {view === 'LOGS' && (
            <div>
                <h3 className="font-bold text-gray-700 mb-2 px-1">Incident History</h3>
                <div className="space-y-2">
                    {incidents.filter(i => i.status === 'RESOLVED').length === 0 ? (
                        <div className="text-center text-gray-400 py-4">No history yet.</div>
                    ) : (
                        incidents.filter(i => i.status === 'RESOLVED').map(inc => (
                            <div key={inc.id} className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-full text-gray-500"><Clock className="w-4 h-4" /></div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-800">{inc.type}</div>
                                        <div className="text-xs text-gray-500">{inc.location} • {inc.timeReported}</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">RESOLVED</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {view === 'PROFILE' && (
            <div className="space-y-4">
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center text-red-600 mb-3">
                        <User className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100">
                        EMS Unit: RES-09
                    </div>
                 </div>

                 {user?.allowedRoles && user.allowedRoles.length > 1 && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Switch Role</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.allowedRoles.map(role => (
                                <button
                                    key={role}
                                    onClick={() => switchRole(role)}
                                    disabled={role === user.role}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                                        role === user.role 
                                        ? 'bg-red-600 border-red-600 text-white' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-700'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><Clock className="w-5 h-5" /></div>
                            <div>
                                <div className="text-sm font-bold text-gray-800">Shift Duration</div>
                                <div className="text-xs text-gray-500">Started: 08:00 AM</div>
                            </div>
                        </div>
                        <span className="text-lg font-mono font-bold text-gray-700">04:32</span>
                    </div>
                 </div>

                 <button 
                    onClick={logout}
                    className="w-full py-4 bg-white border border-gray-200 text-red-600 font-bold rounded-xl shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                 >
                    <LogOut className="w-5 h-5" /> Sign Out
                 </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default ResponderDashboard;