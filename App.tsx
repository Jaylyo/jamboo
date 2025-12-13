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
import { CallProvider, useCall } from './contexts/CallContext';
import GlobalCallUI from './components/GlobalCallUI';
import ChatAssistant from './components/ChatAssistant';

// --- Helper Functions & Components ---

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

interface TabButtonProps {
  tab: AppTab;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: (tab: AppTab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={() => onClick(tab)}
    className={`flex flex-col items-center justify-center w-full py-2 group transition-colors ${isActive ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-teal-50' : ''}`}>
       <Icon className={`w-6 h-6 mb-0.5 ${isActive ? 'fill-teal-600/20' : ''}`} />
    </div>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

interface HomeScreenProps {
  weatherForecast: WeatherData[];
}

const HomeScreen: React.FC<HomeScreenProps> = ({ weatherForecast }) => {
  const { user } = useAuth();
  const { alerts } = useAdvisory();
  const todayWeather = weatherForecast[0];

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 bg-teal-600 text-white rounded-b-3xl shadow-lg shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div>
             <h1 className="text-2xl font-bold">Maayong Buntag!</h1>
             <p className="text-teal-100 text-sm">Welcome to Cebu, {user?.name.split(' ')[0]}</p>
          </div>
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm relative">
             <Bell className="w-5 h-5" />
             {alerts.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-teal-600"></span>}
          </div>
        </div>

        {todayWeather && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/20">
             <div className="flex items-center gap-3">
               <div className="text-yellow-300">
                  {getWeatherIcon(todayWeather.condition, "w-10 h-10")}
               </div>
               <div>
                  <div className="text-3xl font-bold">{todayWeather.temp}°</div>
                  <div className="text-xs text-teal-100">{todayWeather.condition}</div>
               </div>
             </div>
             <div className="text-right">
                <div className={`text-xs font-bold px-2 py-1 rounded-full inline-block mb-1 ${
                  todayWeather.riskLevel === 'Low' ? 'bg-green-500/20 text-green-100' : 
                  todayWeather.riskLevel === 'Moderate' ? 'bg-yellow-500/20 text-yellow-100' : 'bg-red-500/20 text-red-100'
                }`}>
                   {todayWeather.riskLevel} Risk
                </div>
                <div className="text-[10px] text-teal-100">Outdoor Activities</div>
             </div>
          </div>
        )}
      </div>

      <div className="px-5 mt-4 shrink-0">
         {alerts.length > 0 && (
           <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                 <h3 className="text-sm font-bold text-red-800 truncate">{alerts[0].title}</h3>
                 <p className="text-xs text-red-600 truncate">{alerts[0].details}</p>
              </div>
           </div>
         )}
      </div>

      <div className="flex-1 overflow-hidden p-5 flex flex-col min-h-0">
         <h2 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" /> 
            Safety Assistant
         </h2>
         <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <ChatAssistant />
         </div>
      </div>
    </div>
  );
};

interface ExploreScreenProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  exploreCategory: string;
  setExploreCategory: (c: string) => void;
  onAttractionClick: (a: Attraction) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ 
  searchQuery, setSearchQuery, exploreCategory, setExploreCategory, onAttractionClick, favorites, onToggleFavorite 
}) => {
  const { attractions } = useAttraction();
  const categories = ['All', 'Nature', 'Historical', 'Urban', 'Beach', 'Favorites'];
  
  const filteredAttractions = attractions.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          attraction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = exploreCategory === 'All' || 
                            (exploreCategory === 'Favorites' ? favorites.includes(attraction.id) : attraction.category === exploreCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-gray-50">
       <div className="p-5 bg-white shadow-sm sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Explore Cebu</h1>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search safe destinations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setExploreCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  exploreCategory === cat 
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-200' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-5">
          {filteredAttractions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
               <MapPin className="w-12 h-12 mb-2 opacity-20" />
               <p className="text-sm">No places found.</p>
            </div>
          ) : (
            filteredAttractions.map(attraction => (
              <AttractionCard 
                key={attraction.id} 
                data={attraction} 
                onClick={onAttractionClick}
                isFavorite={favorites.includes(attraction.id)}
                onToggleFavorite={(e) => onToggleFavorite(attraction.id)}
              />
            ))
          )}
       </div>
    </div>
  );
};

const MapScreen: React.FC = () => {
    const { attractions } = useAttraction();

    return (
        <div className="h-full relative bg-slate-200 overflow-hidden flex flex-col">
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
                backgroundSize: '24px 24px'
            }}></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <Map className="w-64 h-64 text-slate-500" />
            </div>

            <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm z-10 border border-white/50">
                <h1 className="font-bold text-slate-800 text-lg">Safety Map</h1>
                <p className="text-xs text-slate-500">Showing safe zones and attractions</p>
            </div>

            <div className="flex-1 relative overflow-auto">
                 {attractions.map((attraction, index) => (
                     <div 
                        key={attraction.id}
                        className="absolute flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform group"
                        style={{
                            top: `${20 + (index * 15) % 60}%`,
                            left: `${20 + (index * 25) % 60}%`
                        }}
                     >
                         <div className={`p-1.5 rounded-full border-2 border-white shadow-md ${
                             attraction.safetyLevel === 'Safe' ? 'bg-green-500' :
                             attraction.safetyLevel === 'Caution' ? 'bg-yellow-500' : 'bg-red-500'
                         }`}>
                             <MapPin className="w-4 h-4 text-white" />
                         </div>
                         <div className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                             {attraction.name}
                         </div>
                     </div>
                 ))}
            </div>

            <div className="absolute bottom-24 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-sm z-10 border border-white/50 flex justify-around">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-[10px] font-bold text-slate-600">Safe</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="text-[10px] font-bold text-slate-600">Caution</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-[10px] font-bold text-slate-600">High Risk</span>
                </div>
            </div>
        </div>
    );
};

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
  const { initiateCall } = useCall();
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
          onClick={() => initiateCall('STAFF')}
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
          onClick={() => initiateCall('ADMIN')}
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

  // Render Login Screen
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full h-full max-w-md mx-auto shadow-2xl relative bg-white">
        <AuthScreen />
      </div>
    );
  }

  return (
      <div className="w-full h-full max-w-md bg-gray-50 mx-auto shadow-2xl relative flex flex-col overflow-hidden">
          {/* Global Call UI */}
          <GlobalCallUI />

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
          
          {/* Role-Based Content */}
          {user.role === 'ADMIN' ? (
              <AdminDashboard />
          ) : user.role === 'RESPONDER' ? (
              <ResponderDashboard />
          ) : user.role === 'STAFF' ? (
              <StaffDashboard />
          ) : (
              // --- TOURIST (DEFAULT) APP CONTENT ---
              <>
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
                        {currentTab === AppTab.HOME && <HomeScreen weatherForecast={weatherForecast} />}
                        {currentTab === AppTab.EXPLORE && (
                            <ExploreScreen 
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                exploreCategory={exploreCategory}
                                setExploreCategory={setExploreCategory}
                                onAttractionClick={setSelectedAttraction}
                                favorites={favorites}
                                onToggleFavorite={(id) => toggleFavorite(id)}
                            />
                        )}
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

                  {/* Bottom Navigation */}
                  <div className={`h-[80px] bg-white border-t border-gray-200 flex justify-between items-start px-2 py-3 shrink-0 z-30 transition-transform duration-300 ${selectedAttraction ? 'translate-y-full hidden' : ''}`}>
                    <TabButton tab={AppTab.HOME} icon={Home} label="Home" isActive={currentTab === AppTab.HOME} onClick={setCurrentTab} />
                    <TabButton tab={AppTab.EXPLORE} icon={Compass} label="Explore" isActive={currentTab === AppTab.EXPLORE} onClick={setCurrentTab} />
                    <TabButton tab={AppTab.MAP} icon={Map} label="Map" isActive={currentTab === AppTab.MAP} onClick={setCurrentTab} />
                    
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

                    <TabButton tab={AppTab.PROFILE} icon={User} label="Profile" isActive={currentTab === AppTab.PROFILE} onClick={setCurrentTab} />
                  </div>
              </>
          )}
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
              <CallProvider>
                <MainApp />
              </CallProvider>
            </FacilityProvider>
          </IncidentProvider>
        </AttractionProvider>
      </AdvisoryProvider>
    </AuthProvider>
  );
};

export default App;