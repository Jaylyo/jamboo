import React, { useState, useEffect } from 'react';
import { Home, Map, Compass, User, Bell, Search, AlertTriangle, Navigation as NavIcon, ChevronLeft, ChevronRight, Mail, Shield, Eye, MapPin, Pencil, Save, X, Clock, Cloud, CloudRain, CloudLightning, Sun, CloudSun, Heart, Phone, Trash2, Plus, UserPlus, Headset } from 'lucide-react';
import { AppTab, Attraction, SafetyAlert, WeatherData, PersonalContact } from './types';
import { ATTRACTIONS as STATIC_ATTRACTIONS } from './constants';
import AttractionCard from './components/AttractionCard';
import AttractionDetail from './components/AttractionDetail';
import SOSOverlay from './components/SOSOverlay';
import AuthScreen from './components/AuthScreen';
import AdminDashboard from './components/AdminDashboard';
import ResponderDashboard from './components/ResponderDashboard';
import StaffDashboard from './components/StaffDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdvisoryProvider, useAdvisory } from './contexts/AdvisoryContext';
import { IncidentProvider } from './contexts/IncidentContext';
import { AttractionProvider, useAttraction } from './contexts/AttractionContext';
import { FacilityProvider, useFacility } from './contexts/FacilityContext';
import { getWeatherForecast } from './services/weatherService';

// --- Extracted ProfileScreen ---
interface ProfileScreenProps {
  personalContacts: PersonalContact[];
  setPersonalContacts: React.Dispatch<React.SetStateAction<PersonalContact[]>>;
  favoritesCount: number;
  onNavigateToFavorites: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  personalContacts, 
  setPersonalContacts, 
  favoritesCount, 
  onNavigateToFavorites 
}) => {
  const { user, logout, switchRole } = useAuth();
  const [view, setView] = useState<'MAIN' | 'SETTINGS' | 'EDIT_PROFILE' | 'EMERGENCY_CONTACTS'>('MAIN');
  
  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: user?.name || 'User',
    email: user?.email || 'email@example.com'
  });

  const [newContact, setNewContact] = useState({ name: '', number: '', relation: '' });
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Edit Form State
  const [editFormData, setEditFormData] = useState(userProfile);

  // Mock Settings State
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailAlerts: false,
    emergencyAlerts: true,
    locationSharing: true,
    dataCollection: false,
    publicProfile: false
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({...prev, [key]: !prev[key]}));
  };

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${active ? 'bg-teal-600' : 'bg-gray-300'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.number) return;
    
    const contact: PersonalContact = {
      id: Date.now().toString(),
      name: newContact.name,
      number: newContact.number,
      relation: newContact.relation || 'Friend'
    };
    
    setPersonalContacts([...personalContacts, contact]);
    setNewContact({ name: '', number: '', relation: '' });
    setIsAddingContact(false);
  };

  const handleDeleteContact = (id: string) => {
    setPersonalContacts(prev => prev.filter(c => c.id !== id));
  };

  if (view === 'EMERGENCY_CONTACTS') {
    return (
      <div className="bg-gray-50 h-full flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 flex items-center gap-3 shadow-sm sticky top-0 z-10 border-b border-gray-100">
          <button onClick={() => setView('MAIN')} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h2 className="font-bold text-lg text-slate-800">Emergency Contacts</h2>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
           {/* Add Contact Modal/Form */}
           {isAddingContact && (
             <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-gray-800">Add New Contact</h3>
                  <button onClick={() => setIsAddingContact(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleAddContact} className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={newContact.name}
                      onChange={e => setNewContact({...newContact, name: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required 
                    />
                    <input 
                      type="tel" 
                      placeholder="Mobile Number" 
                      value={newContact.number}
                      onChange={e => setNewContact({...newContact, number: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required 
                    />
                    <input 
                      type="text" 
                      placeholder="Relationship (e.g. Family)" 
                      value={newContact.relation}
                      onChange={e => setNewContact({...newContact, relation: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button className="w-full py-2.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 text-sm">Save Contact</button>
                </form>
             </div>
           )}

           {/* Contact List */}
           <div className="space-y-3">
             {personalContacts.length === 0 ? (
               <div className="text-center p-8 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                  <UserPlus className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No contacts added yet.</p>
               </div>
             ) : (
               personalContacts.map(contact => (
                 <div key={contact.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{contact.name}</h3>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                           <span className="font-medium bg-gray-100 px-1.5 rounded">{contact.relation}</span>
                           <span>•</span>
                           <span>{contact.number}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Floating Action Button */}
        {!isAddingContact && (
          <div className="absolute bottom-6 right-6">
            <button 
              onClick={() => setIsAddingContact(true)}
              className="w-14 h-14 bg-teal-600 rounded-full shadow-lg text-white flex items-center justify-center hover:bg-teal-700 hover:scale-105 transition-all"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (view === 'EDIT_PROFILE') {
    return (
      <div className="bg-gray-50 h-full flex flex-col">
        <div className="bg-white p-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
          <button onClick={() => setView('MAIN')} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h2 className="font-bold text-lg text-slate-800">Edit Profile</h2>
        </div>
        
        <div className="p-5 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              value={editFormData.name}
              onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              value={editFormData.email}
              onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <div className="pt-4">
            <button 
              onClick={() => {
                setUserProfile(editFormData);
                setView('MAIN');
              }}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'SETTINGS') {
    return (
      <div className="bg-gray-50 h-full flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
          <button onClick={() => setView('MAIN')} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h2 className="font-bold text-lg text-slate-800">Settings</h2>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto pb-24">
          {/* Notifications */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Notifications</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bell className="w-5 h-5" /></div>
                  <span className="text-sm font-medium text-slate-700">Push Notifications</span>
                </div>
                <Toggle active={settings.pushNotifications} onToggle={() => toggle('pushNotifications')} />
              </div>
              <div className="p-4 flex justify-between items-center border-b border-gray-50">
                 <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Mail className="w-5 h-5" /></div>
                  <span className="text-sm font-medium text-slate-700">Email Alerts</span>
                </div>
                <Toggle active={settings.emailAlerts} onToggle={() => toggle('emailAlerts')} />
              </div>
              <div className="p-4 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
                  <span className="text-sm font-medium text-slate-700">Emergency Alerts</span>
                </div>
                <Toggle active={settings.emergencyAlerts} onToggle={() => toggle('emergencyAlerts')} />
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Privacy & Security</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><MapPin className="w-5 h-5" /></div>
                  <div className="flex flex-col">
                       <span className="text-sm font-medium text-slate-700">Location Sharing</span>
                       <span className="text-[10px] text-gray-400">Allow responders to see location</span>
                  </div>
                </div>
                <Toggle active={settings.locationSharing} onToggle={() => toggle('locationSharing')} />
              </div>
              <div className="p-4 flex justify-between items-center border-b border-gray-50">
                 <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Shield className="w-5 h-5" /></div>
                  <span className="text-sm font-medium text-slate-700">Data Collection</span>
                </div>
                <Toggle active={settings.dataCollection} onToggle={() => toggle('dataCollection')} />
              </div>
               <div className="p-4 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Eye className="w-5 h-5" /></div>
                  <span className="text-sm font-medium text-slate-700">Public Profile</span>
                </div>
                <Toggle active={settings.publicProfile} onToggle={() => toggle('publicProfile')} />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Account</h1>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 mb-6 relative">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">👤</div>
        <div>
          <h2 className="font-bold text-lg">{userProfile.name}</h2>
          <p className="text-sm text-gray-500">{userProfile.email}</p>
        </div>
        <button 
          onClick={() => {
            setEditFormData(userProfile);
            setView('EDIT_PROFILE');
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* Support Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          onClick={() => window.location.href = 'tel:0917-STAFF-HELP'}
          className="bg-teal-50 p-4 rounded-xl border border-teal-100 flex items-center justify-center gap-3 hover:bg-teal-100 transition-colors shadow-sm"
        >
          <div className="p-2 bg-white rounded-full text-teal-600 shadow-sm">
            <Headset className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold text-teal-600 uppercase tracking-wide">Support</div>
            <div className="text-sm font-bold text-teal-900">Call Staff</div>
          </div>
        </button>

        <button 
          onClick={() => window.location.href = 'tel:0917-ADMIN-HELP'}
          className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center justify-center gap-3 hover:bg-purple-100 transition-colors shadow-sm"
        >
          <div className="p-2 bg-white rounded-full text-purple-600 shadow-sm">
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">Escalate</div>
            <div className="text-sm font-bold text-purple-900">Call Admin</div>
          </div>
        </button>
      </div>

      {user?.allowedRoles && user.allowedRoles.length > 1 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Switch Profile</h3>
              <div className="flex flex-wrap gap-2">
                  {user.allowedRoles.map(role => (
                      <button
                          key={role}
                          onClick={() => switchRole(role)}
                          disabled={role === user.role}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                              role === user.role
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-100'
                          }`}
                      >
                          {role}
                      </button>
                  ))}
              </div>
          </div>
      )}

      <div className="space-y-2">
          <button 
              onClick={onNavigateToFavorites}
              className="w-full text-left p-4 bg-white border border-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex justify-between items-center"
          >
              My Favorites
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{favoritesCount}</span>
          </button>
          
          <button 
            onClick={() => setView('EMERGENCY_CONTACTS')}
            className="w-full text-left p-4 bg-white border border-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex justify-between items-center"
          >
             Emergency Contacts
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

         {['Offline Maps'].map((item) => (
            <button key={item} className="w-full text-left p-4 bg-white border border-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                {item}
            </button>
         ))}
         <button onClick={() => setView('SETTINGS')} className="w-full text-left p-4 bg-white border border-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex justify-between items-center">
              Settings
              <ChevronRight className="w-4 h-4 text-gray-400" />
         </button>
         <button 
           onClick={logout}
           className="w-full text-left p-4 bg-white border border-red-100 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium"
         >
            Log Out
         </button>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg text-xs text-blue-800 leading-relaxed">
        <strong>About:</strong> CebuSafeTour is a prototype application designed to enhance tourist safety in Cebu Province. It integrates emergency response features with tourism information.
      </div>
    </div>
  );
};

// --- Main App Component ---

const MainApp: React.FC = () => {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const { alerts } = useAdvisory();
  const { attractions } = useAttraction(); // Use global attractions
  const { facilities } = useFacility(); // Use global facilities
  
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.HOME);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreCategory, setExploreCategory] = useState('All');
  
  // Notification States
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [toastAlert, setToastAlert] = useState<SafetyAlert | null>(null);

  // Weather State
  const [weatherForecast, setWeatherForecast] = useState<WeatherData[]>([]);

  // Navigation State
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  // Favorites State
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Lifted Personal Contacts State (Accessible to both Profile and SOS Overlay)
  // Initialize from LocalStorage if available
  const [personalContacts, setPersonalContacts] = useState<PersonalContact[]>(() => {
    try {
      const saved = localStorage.getItem('cebu_safe_tourist_contacts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load contacts', e);
      return [];
    }
  });

  // Persist contacts when they change
  useEffect(() => {
    try {
      localStorage.setItem('cebu_safe_tourist_contacts', JSON.stringify(personalContacts));
    } catch (e) {
      console.error('Failed to save contacts', e);
    }
  }, [personalContacts]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  // Monitor alerts for notifications
  useEffect(() => {
    if (alerts.length > 0) {
      // Trigger toast for the most recent alert
      setToastAlert(alerts[0]);
      const timer = setTimeout(() => setToastAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  // Load weather on mount
  useEffect(() => {
    setWeatherForecast(getWeatherForecast());
  }, []);

  // Helper for weather icons
  const getWeatherIcon = (condition: string, className = "w-6 h-6") => {
    switch (condition) {
      case 'Sunny': return <Sun className={className} />;
      case 'Partly Cloudy': return <CloudSun className={className} />;
      case 'Cloudy': return <Cloud className={className} />;
      case 'Rainy': return <CloudRain className={className} />;
      case 'Stormy': return <CloudLightning className={className} />;
      default: return <Sun className={className} />;
    }
  };

  // Render Login Screen
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full h-full max-w-md mx-auto shadow-2xl relative bg-white">
        <AuthScreen />
      </div>
    );
  }

  // Render Role-Based Dashboards
  if (user.role === 'ADMIN') {
    return (
       <div className="w-full h-full max-w-md mx-auto shadow-2xl relative bg-white">
          <AdminDashboard />
       </div>
    );
  }

  if (user.role === 'RESPONDER') {
    return (
       <div className="w-full h-full max-w-md mx-auto shadow-2xl relative bg-white">
          <ResponderDashboard />
       </div>
    );
  }

  if (user.role === 'STAFF') {
    return (
       <div className="w-full h-full max-w-md mx-auto shadow-2xl relative bg-white">
          <StaffDashboard />
       </div>
    );
  }

  // --- TOURIST (DEFAULT) APP LOGIC ---

  // Tab Navigation Component
  const TabButton = ({ tab, icon: Icon, label }: { tab: AppTab; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentTab(tab);
        setSelectedAttraction(null); // Reset selection when changing tabs
      }}
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
        currentTab === tab && !selectedAttraction ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${currentTab === tab && !selectedAttraction ? 'fill-current' : ''}`} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  // --- Screens ---

  const HomeScreen = () => {
    const currentWeather: WeatherData = weatherForecast[0] || { 
      day: 'Today', 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      temp: 28, 
      condition: 'Sunny', 
      riskLevel: 'Low' 
    };

    return (
      <div className="p-5 pb-24 space-y-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center relative z-20">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">CebuSafeTour</h1>
            <p className="text-sm text-gray-500">Welcome, {user.name}</p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={`p-2 rounded-full shadow-sm border relative transition-colors ${isNotificationOpen ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-100'}`}
            >
              <Bell className={`w-5 h-5 ${isNotificationOpen ? 'text-teal-600' : 'text-gray-600'}`} />
              {alerts.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                  <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-gray-700">Notifications</h3>
                      <button onClick={() => setIsNotificationOpen(false)}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                      {alerts.length === 0 ? (
                          <div className="p-6 text-center text-xs text-gray-400">No new notifications</div>
                      ) : (
                          alerts.map(alert => (
                              <div key={alert.id} className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                  <div className="flex justify-between items-start mb-1">
                                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                          alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                          alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                          'bg-blue-100 text-blue-700'
                                      }`}>{alert.severity.toUpperCase()}</span>
                                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {alert.timestamp}
                                      </span>
                                  </div>
                                  <h4 className="font-bold text-sm text-gray-800">{alert.title}</h4>
                                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{alert.details}</p>
                              </div>
                          ))
                      )}
                  </div>
                  {alerts.length > 0 && (
                    <div className="p-2 bg-gray-50 text-center text-[10px] text-gray-400 border-t border-gray-100">
                        Stay safe and alert
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Weather/Safety Status Card */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden transition-all">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                {currentWeather.day}, {currentWeather.date}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold flex items-center gap-2">
                  {currentWeather.temp}°C
                  {getWeatherIcon(currentWeather.condition, "w-8 h-8 opacity-80")}
                </div>
                <div className="text-sm opacity-90 mt-1">{currentWeather.condition} • {currentWeather.riskLevel} Risk</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">Cebu City</div>
                <div className="text-xs opacity-75">AQI: 45 (Good)</div>
              </div>
            </div>
          </div>
          {/* Decorative circle */}
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-3">5-Day Forecast</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {weatherForecast.slice(1, 6).map((day, idx) => (
              <div key={idx} className="min-w-[80px] bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center shadow-sm">
                <span className="text-xs font-bold text-gray-600">{day.day}</span>
                <div className="my-2 text-teal-600">
                  {getWeatherIcon(day.condition)}
                </div>
                <span className="text-sm font-bold text-gray-800">{day.temp}°</span>
                <span className="text-[10px] text-gray-400 mt-1">{day.condition}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts Section */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Safety Alerts
            </h3>
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-lg">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-orange-800 text-sm">{alert.title}</h4>
                  <span className="text-[10px] bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded">{alert.timestamp}</span>
                </div>
                <p className="text-xs text-orange-700 mt-1">{alert.details}</p>
                {alert.location && <div className="text-[10px] text-orange-600 mt-2 font-medium">📍 {alert.location}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setCurrentTab(AppTab.MAP)}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <Map className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Find Police</span>
          </button>
          <button 
            onClick={() => setCurrentTab(AppTab.EXPLORE)}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Safe Spots</span>
          </button>
        </div>

        {/* Featured Attraction */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3">Recommended for You</h3>
          <AttractionCard 
            data={attractions[0]} 
            onClick={setSelectedAttraction} 
            isFavorite={favorites.includes(attractions[0].id)}
            onToggleFavorite={(e) => toggleFavorite(attractions[0].id, e)}
          />
        </div>
      </div>
    );
  };

  const ExploreScreen = () => {
    const categories = ['All', 'Favorites', 'Nature', 'Historical', 'Urban', 'Beach'];
    
    const filteredAttractions = attractions.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = exploreCategory === 'All' 
            ? true 
            : exploreCategory === 'Favorites' 
                ? favorites.includes(a.id)
                : a.category === exploreCategory;
        
        return matchesSearch && matchesCategory;
    });

    return (
      <div className="p-5 pb-24 space-y-4">
        <div className="sticky top-0 bg-gray-100 z-10 pt-2 pb-4">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Explore Cebu</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search attractions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setExploreCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${
                exploreCategory === cat 
                  ? 'bg-teal-600 text-white border-teal-600' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4 min-h-[50vh]">
          {filteredAttractions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
               <div className="mb-2 opacity-50 text-4xl">🏝️</div>
               <p className="text-sm">No attractions found.</p>
            </div>
          ) : (
             filteredAttractions.map((attraction) => (
                <AttractionCard 
                  key={attraction.id} 
                  data={attraction} 
                  onClick={setSelectedAttraction} 
                  isFavorite={favorites.includes(attraction.id)}
                  onToggleFavorite={(e) => toggleFavorite(attraction.id, e)}
                />
              ))
          )}
        </div>
      </div>
    );
  };

  const MapScreen = () => {
    const handleNavigateToFacility = (facilityName: string) => {
       const query = encodeURIComponent(`${facilityName}, Cebu`);
       window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    return (
      <div className="h-full bg-gray-50 flex flex-col pb-24 animate-in fade-in">
        {/* Header */}
        <div className="bg-white p-5 shadow-sm sticky top-0 z-10 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-slate-800">Emergency Hub</h1>
          <p className="text-sm text-gray-500 mt-1">Locate nearby help centers & services</p>
        </div>

        {/* List */}
        <div className="p-4 space-y-4 overflow-y-auto scrollbar-hide">
          {facilities.map(contact => (
            <div key={contact.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                 {/* Icon Box */}
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    contact.type === 'Medical' ? 'bg-red-50 text-red-600' :
                    contact.type === 'Fire' ? 'bg-orange-50 text-orange-600' :
                    'bg-blue-50 text-blue-600'
                 }`}>
                    {contact.type === 'Medical' && <Heart className="w-6 h-6 fill-current" />}
                    {contact.type === 'Fire' && <AlertTriangle className="w-6 h-6" />}
                    {(contact.type === 'Police' || contact.type === 'Tourism') && <Shield className="w-6 h-6" />}
                 </div>
                 
                 <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{contact.name}</h3>
                        <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{contact.distance}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{contact.type} Department</div>
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-2 font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Open 24/7
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50">
                <a 
                  href={`tel:${contact.number}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
                <button 
                  onClick={() => handleNavigateToFacility(contact.name)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20"
                >
                  <NavIcon className="w-4 h-4" />
                  Map
                </button>
              </div>
            </div>
          ))}

          {/* Additional Info Box */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start mt-2">
             <div className="p-2 bg-blue-100 rounded-full text-blue-600 shrink-0">
                <MapPin className="w-5 h-5" />
             </div>
             <div>
                <h4 className="font-bold text-blue-900 text-sm">Need directions?</h4>
                <p className="text-xs text-blue-700 mt-1">
                    Click the "Map" button on any facility to open GPS navigation immediately.
                </p>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full max-w-md bg-gray-50 mx-auto shadow-2xl relative flex flex-col overflow-hidden">
      
      {/* SOS Overlay */}
      <SOSOverlay isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} personalContacts={personalContacts} />

      {/* Notification Toast */}
      {toastAlert && (
        <div className="absolute top-4 left-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-4 border-l-4 border-red-500 flex items-start gap-3 pointer-events-auto">
                <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                         <h3 className="font-bold text-gray-800 text-sm">New Alert: {toastAlert.title}</h3>
                         <span className="text-[10px] text-gray-400">{toastAlert.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{toastAlert.details}</p>
                </div>
                <button onClick={() => setToastAlert(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {selectedAttraction ? (
          <AttractionDetail 
            attraction={selectedAttraction} 
            onBack={() => setSelectedAttraction(null)} 
            isFavorite={favorites.includes(selectedAttraction.id)}
            onToggleFavorite={() => toggleFavorite(selectedAttraction.id)}
          />
        ) : (
          <>
            {currentTab === AppTab.HOME && <HomeScreen />}
            {currentTab === AppTab.EXPLORE && <ExploreScreen />}
            {currentTab === AppTab.MAP && <MapScreen />}
            {currentTab === AppTab.PROFILE && (
                <ProfileScreen 
                    personalContacts={personalContacts} 
                    setPersonalContacts={setPersonalContacts}
                    favoritesCount={favorites.length}
                    onNavigateToFavorites={() => {
                        setCurrentTab(AppTab.EXPLORE);
                        setExploreCategory('Favorites');
                    }}
                />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation (Hidden when Detail View is active for cleaner look, or standard mobile pattern) */}
      <div className={`h-[80px] bg-white border-t border-gray-200 flex justify-between items-start px-2 py-3 shrink-0 z-30 transition-transform duration-300 ${selectedAttraction ? 'translate-y-full hidden' : ''}`}>
        <TabButton tab={AppTab.HOME} icon={Home} label="Home" />
        <TabButton tab={AppTab.EXPLORE} icon={Compass} label="Explore" />
        <TabButton tab={AppTab.MAP} icon={Map} label="Map" />
        
        {/* SOS Button (Integrated in Nav) */}
        {user.role === 'TOURIST' && (
            <button 
                onClick={() => setIsSOSOpen(true)}
                className="flex flex-col items-center justify-center w-full py-2 group"
            >
                <div className="bg-red-50 group-hover:bg-red-100 p-1 rounded-xl transition-colors mb-0.5 border border-red-100">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-[10px] font-bold text-red-600">SOS</span>
            </button>
        )}

        <TabButton tab={AppTab.PROFILE} icon={User} label="Profile" />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AdvisoryProvider>
        <AttractionProvider>
          <IncidentProvider>
            <FacilityProvider>
              <MainApp />
            </FacilityProvider>
          </IncidentProvider>
        </AttractionProvider>
      </AdvisoryProvider>
    </AuthProvider>
  );
};

export default App;