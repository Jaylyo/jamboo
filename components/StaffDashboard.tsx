import React, { useState } from 'react';
import { LayoutGrid, Plus, Bell, FileText, LogOut, Map, Search, History, BellRing, Clock, User, ChevronRight, Settings, Shield, X, Image as ImageIcon, Edit2, Building2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAttraction } from '../contexts/AttractionContext';
import { useAdvisory } from '../contexts/AdvisoryContext';
import { Attraction } from '../types';
import { useFacility } from '../contexts/FacilityContext';

const StaffDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const { attractions, addAttraction, updateAttraction } = useAttraction();
  const { addAlert } = useAdvisory();
  const { facilities, addFacility, removeFacility } = useFacility();
  
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'ATTRACTIONS' | 'HISTORY' | 'FACILITIES' | 'PROFILE'>('ALERTS');

  // UI State for Attractions Tab
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Attraction>>({
    name: '',
    category: 'Nature',
    imageUrl: '',
    safetyLevel: 'Safe',
    description: '',
    rating: 4.5
  });

  // UI State for Facilities Tab
  const [newFacility, setNewFacility] = useState({
    name: '',
    number: '',
    type: 'Police',
    distance: ''
  });

  const handleAddFacility = (e: React.FormEvent) => {
    e.preventDefault();
    addFacility({
        name: newFacility.name,
        number: newFacility.number,
        type: newFacility.type as any,
        distance: newFacility.distance || 'Unknown'
    });
    setNewFacility({ name: '', number: '', type: 'Police', distance: '' });
  };

  // UI State for Alerts Tab
  const [alertForm, setAlertForm] = useState({
      title: '',
      severity: 'medium',
      location: '',
      details: ''
  });

  // Mock Notification History (Static for now)
  const notificationLogs = [
     { id: 101, title: 'Typhoon Warning Signal #1', category: 'Safety Alert', sentAt: 'Oct 24, 10:00 AM', audience: 'All Users' },
     { id: 102, title: 'Traffic Update: SRP', category: 'Advisory', sentAt: 'Oct 23, 08:30 AM', audience: 'Tourists' },
     { id: 103, title: 'Kawasan Falls Closure', category: 'Attraction Update', sentAt: 'Oct 20, 01:00 PM', audience: 'All Users' },
     { id: 104, title: 'Sinulog Parade Rerouting', category: 'Advisory', sentAt: 'Oct 18, 09:15 AM', audience: 'Tourists' },
  ];

  // --- Attraction Handlers ---
  const resetForm = () => {
    setFormData({ name: '', category: 'Nature', imageUrl: '', safetyLevel: 'Safe', description: '', rating: 4.5 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleCreateClick = () => {
    setFormData({ name: '', category: 'Nature', imageUrl: '', safetyLevel: 'Safe', description: '', rating: 4.5 });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (attraction: Attraction) => {
    setFormData({ ...attraction });
    setEditingId(attraction.id);
    setShowForm(true);
  };

  const handleSaveAttraction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
        // Update existing attraction via Context
        updateAttraction({ ...formData, id: editingId } as Attraction);
    } else {
        // Create new attraction via Context
        const newAttraction: Attraction = {
            id: Date.now().toString(),
            name: formData.name || 'New Attraction',
            category: formData.category as any,
            imageUrl: formData.imageUrl || 'https://picsum.photos/400/300', // Fallback image
            safetyLevel: formData.safetyLevel as any,
            description: formData.description || 'No description provided.',
            rating: formData.rating || 0
        };
        addAttraction(newAttraction);
    }
    
    resetForm();
  };

  // --- Alert Handlers ---
  const handlePublishAlert = (e: React.FormEvent) => {
      e.preventDefault();
      addAlert({
          title: alertForm.title,
          severity: alertForm.severity as any,
          location: alertForm.location,
          details: alertForm.details
      });
      setAlertForm({ title: '', severity: 'medium', location: '', details: '' });
      alert("Safety Alert Published successfully!");
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="p-4 bg-teal-600 text-white shadow-md flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <BriefcaseIcon className="w-5 h-5" />
            Staff Portal
          </h1>
          <p className="text-xs text-teal-100 opacity-80">Tourism Office</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-2 bg-white shadow-sm gap-2 overflow-x-auto scrollbar-hide">
        <button 
            onClick={() => setActiveTab('ALERTS')}
            className={`flex-1 min-w-[80px] py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap px-2 ${activeTab === 'ALERTS' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            Manage Alerts
        </button>
        <button 
            onClick={() => setActiveTab('ATTRACTIONS')}
            className={`flex-1 min-w-[80px] py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap px-2 ${activeTab === 'ATTRACTIONS' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            Attractions
        </button>
        <button 
            onClick={() => setActiveTab('FACILITIES')}
            className={`flex-1 min-w-[80px] py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap px-2 ${activeTab === 'FACILITIES' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            Facilities
        </button>
        <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`flex-1 min-w-[80px] py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap px-2 ${activeTab === 'HISTORY' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            History
        </button>
        <button 
            onClick={() => setActiveTab('PROFILE')}
            className={`flex-1 min-w-[80px] py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap px-2 ${activeTab === 'PROFILE' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            Profile
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-4">
        {activeTab === 'ALERTS' && (
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-teal-600" />
                        Create New Safety Alert
                    </h2>
                    <form onSubmit={handlePublishAlert} className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-500">Alert Title</label>
                            <input 
                                type="text" 
                                required
                                value={alertForm.title}
                                onChange={e => setAlertForm({...alertForm, title: e.target.value})}
                                className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                placeholder="e.g. Typhoon Warning" 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500">Severity</label>
                                <select 
                                    value={alertForm.severity}
                                    onChange={e => setAlertForm({...alertForm, severity: e.target.value})}
                                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm bg-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Location</label>
                                <input 
                                    type="text" 
                                    value={alertForm.location}
                                    onChange={e => setAlertForm({...alertForm, location: e.target.value})}
                                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm" 
                                    placeholder="Area affected" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Details</label>
                            <textarea 
                                value={alertForm.details}
                                onChange={e => setAlertForm({...alertForm, details: e.target.value})}
                                className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                placeholder="Describe the situation..." 
                            />
                        </div>
                        <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700">
                            Publish Alert
                        </button>
                    </form>
                </div>

                <div>
                    <h3 className="font-bold text-gray-700 mb-2 px-1 text-sm uppercase">Active Alerts</h3>
                    <div className="space-y-2">
                        <div className="bg-white p-3 border-l-4 border-orange-500 rounded-r-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-sm text-gray-800">Heavy Rain Advisory</span>
                                <span className="text-[10px] text-gray-400">2 hrs ago</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-1">Expect heavy rainfall in Cebu City...</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'ATTRACTIONS' && (
            <div className="space-y-4">
                {!showForm ? (
                    <button 
                        onClick={handleCreateClick}
                        className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold shadow-sm hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Attraction
                    </button>
                ) : (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                {editingId ? <Edit2 className="w-4 h-4 text-teal-600" /> : <Map className="w-4 h-4 text-teal-600" />}
                                {editingId ? 'Edit Attraction' : 'New Attraction Details'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveAttraction} className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500">Attraction Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                    placeholder="e.g. Oslob Whale Shark Watching" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                                        className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="Nature">Nature</option>
                                        <option value="Historical">Historical</option>
                                        <option value="Urban">Urban</option>
                                        <option value="Beach">Beach</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Safety Level</label>
                                    <select 
                                        value={formData.safetyLevel}
                                        onChange={(e) => setFormData({...formData, safetyLevel: e.target.value as any})}
                                        className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="Safe">Safe</option>
                                        <option value="Caution">Caution</option>
                                        <option value="High Risk">High Risk</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Image URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                        className="w-full mt-1 pl-9 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                        placeholder="https://..." 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                    placeholder="Provide a brief description and safety notes..." 
                                />
                            </div>
                            <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700">
                                {editingId ? 'Update Attraction' : 'Save Attraction'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search attractions..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>

                <div className="space-y-3">
                    {attractions.map(attraction => (
                        <div key={attraction.id} className="bg-white p-3 rounded-xl flex gap-3 shadow-sm border border-gray-100">
                             <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                <img src={attraction.imageUrl} className="w-full h-full object-cover" alt="" onError={(e) => (e.currentTarget.src = 'https://picsum.photos/400/300')} />
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800 text-sm">{attraction.name}</h3>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${attraction.safetyLevel === 'Safe' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {attraction.safetyLevel}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{attraction.description}</p>
                                <div className="mt-2 flex gap-2">
                                    <button 
                                        onClick={() => handleEditClick(attraction)}
                                        className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium hover:bg-gray-200 border border-gray-200 flex items-center gap-1"
                                    >
                                        Edit
                                    </button>
                                    <button className="text-[10px] bg-red-50 px-2 py-1 rounded text-red-600 font-medium hover:bg-red-100 border border-red-100">Flag Safety Issue</button>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'FACILITIES' && (
            <div className="space-y-6">
                <h2 className="font-bold text-lg text-gray-800">Manage Emergency Facilities</h2>
                
                {/* Add Facility Form */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-teal-600" /> Add New Facility
                    </h3>
                    <form onSubmit={handleAddFacility} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <input 
                                type="text" 
                                placeholder="Facility Name" 
                                value={newFacility.name}
                                onChange={e => setNewFacility({...newFacility, name: e.target.value})}
                                required
                                className="bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                             <input 
                                type="text" 
                                placeholder="Contact Number" 
                                value={newFacility.number}
                                onChange={e => setNewFacility({...newFacility, number: e.target.value})}
                                required
                                className="bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                             <select 
                                value={newFacility.type}
                                onChange={e => setNewFacility({...newFacility, type: e.target.value})}
                                className="bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                             >
                                <option value="Police">Police</option>
                                <option value="Medical">Medical</option>
                                <option value="Fire">Fire</option>
                                <option value="Tourism">Tourism</option>
                             </select>
                             <input 
                                type="text" 
                                placeholder="Distance (e.g. 1.5 km)" 
                                value={newFacility.distance}
                                onChange={e => setNewFacility({...newFacility, distance: e.target.value})}
                                className="bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg text-sm transition-colors shadow-lg shadow-teal-500/20">
                            Add Facility
                        </button>
                    </form>
                </div>

                {/* Facilities List */}
                <div className="space-y-2">
                    {facilities.map(facility => (
                        <div key={facility.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                    facility.type === 'Medical' ? 'bg-red-50 text-red-600' :
                                    facility.type === 'Fire' ? 'bg-orange-50 text-orange-600' :
                                    'bg-blue-50 text-blue-600'
                                }`}>
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-gray-800">{facility.name}</div>
                                    <div className="text-xs text-gray-500">{facility.type} • {facility.number}</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeFacility(facility.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'PROFILE' && (
            <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                     <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-2xl font-bold">
                        {user?.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-gray-800">{user?.name}</h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <div className="text-xs font-medium text-teal-600 mt-1">Tourism Office Staff</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Account Settings</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                     <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Security</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                     <button onClick={logout} className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-red-50 group">
                        <div className="flex items-center gap-3">
                            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600" />
                            <span className="text-sm font-medium text-red-500 group-hover:text-red-700">Log Out</span>
                        </div>
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

// Helper Icon
const BriefcaseIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

export default StaffDashboard;