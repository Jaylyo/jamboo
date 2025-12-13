import React, { useState } from 'react';
import { Users, AlertTriangle, Activity, Settings, BarChart3, LogOut, Search, UserCheck, Shield, Plus, X, Bell, CheckCircle2, Clock, User as UserIcon, Filter, Radio, Building2, Trash2, Mail, Phone, Globe, Calendar } from 'lucide-react';
import { useAdvisory } from '../contexts/AdvisoryContext';
import { useAuth } from '../contexts/AuthContext';
import { useIncident } from '../contexts/IncidentContext';
import { useFacility } from '../contexts/FacilityContext';
import { UserRole } from '../types';

const AdminDashboard: React.FC = () => {
  const { logout, user, switchRole, allUsers, addUser } = useAuth();
  const { alerts, addAlert } = useAdvisory();
  const { incidents } = useIncident();
  const { facilities, addFacility, removeFacility } = useFacility();
  
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'NOTIFICATIONS' | 'FACILITIES' | 'PROFILE'>('OVERVIEW');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddAlert, setShowAddAlert] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'STAFF',
    status: 'Active',
    phone: '',
    nationality: '',
    sex: '',
    birthdate: ''
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate age if birthdate is present
    let age;
    if (newUserForm.birthdate) {
        const birthDate = new Date(newUserForm.birthdate);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    }

    addUser({
        name: newUserForm.name,
        email: newUserForm.email,
        role: newUserForm.role as UserRole,
        status: newUserForm.status as 'Active' | 'Suspended',
        phone: newUserForm.phone,
        nationality: newUserForm.nationality,
        sex: newUserForm.sex,
        birthdate: newUserForm.birthdate,
        age: age
    });
    setShowAddUser(false);
    setNewUserForm({ 
        name: '', email: '', role: 'STAFF', status: 'Active', 
        phone: '', nationality: '', sex: '', birthdate: '' 
    });
    // Optional: Alert or Toast
  };

  // New Facility Form State
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

  const [newAlert, setNewAlert] = useState({
      title: '',
      severity: 'medium',
      details: '',
      location: ''
  });

  const handleCreateAlert = (e: React.FormEvent) => {
      e.preventDefault();
      addAlert({
          title: newAlert.title,
          severity: newAlert.severity as any,
          details: newAlert.details,
          location: newAlert.location
      });
      setShowAddAlert(false);
      setNewAlert({ title: '', severity: 'medium', details: '', location: '' });
  };

  // Filter Logic using allUsers from Context
  const filteredUsers = allUsers.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
  });
  
  const activeSOS = incidents.filter(i => i.status !== 'RESOLVED');

  return (
    <div className="h-full bg-slate-900 text-white flex flex-col relative">
      {/* Header */}
      <header className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Console</h1>
            <p className="text-xs text-slate-400">Welcome, {user?.name}</p>
          </div>
        </div>
      </header>

      {/* Nav */}
      <div className="flex border-b border-slate-700 overflow-x-auto scrollbar-hide">
        <button 
           onClick={() => setActiveTab('OVERVIEW')}
           className={`flex-1 min-w-[80px] py-3 text-sm font-medium transition-colors whitespace-nowrap px-2 ${activeTab === 'OVERVIEW' ? 'bg-slate-800 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:bg-slate-800/50'}`}
        >
            Overview
        </button>
        <button 
           onClick={() => setActiveTab('USERS')}
           className={`flex-1 min-w-[80px] py-3 text-sm font-medium transition-colors whitespace-nowrap px-2 ${activeTab === 'USERS' ? 'bg-slate-800 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:bg-slate-800/50'}`}
        >
            Users
        </button>
        <button 
           onClick={() => setActiveTab('NOTIFICATIONS')}
           className={`flex-1 min-w-[80px] py-3 text-sm font-medium transition-colors whitespace-nowrap px-2 ${activeTab === 'NOTIFICATIONS' ? 'bg-slate-800 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:bg-slate-800/50'}`}
        >
            Advisories
        </button>
        <button 
           onClick={() => setActiveTab('FACILITIES')}
           className={`flex-1 min-w-[80px] py-3 text-sm font-medium transition-colors whitespace-nowrap px-2 ${activeTab === 'FACILITIES' ? 'bg-slate-800 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:bg-slate-800/50'}`}
        >
            Facilities
        </button>
        <button 
           onClick={() => setActiveTab('PROFILE')}
           className={`flex-1 min-w-[80px] py-3 text-sm font-medium transition-colors whitespace-nowrap px-2 ${activeTab === 'PROFILE' ? 'bg-slate-800 text-white border-b-2 border-purple-500' : 'text-slate-400 hover:bg-slate-800/50'}`}
        >
            Profile
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'OVERVIEW' && (
            <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Users</div>
                    <div className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {allUsers.length}
                    </div>
                    <div className="text-[10px] text-green-500 mt-2">Registered Accounts</div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Active Alerts</div>
                    <div className="text-2xl font-bold text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      {alerts.length}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2">Live Advisories</div>
                  </div>
                </div>
                
                {/* Live SOS Feed */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                   <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-red-900/20">
                    <h3 className="font-bold text-sm text-red-400 flex items-center gap-2">
                         <Radio className="w-4 h-4 animate-pulse" /> Live SOS Feed
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-red-900/50 text-red-400 text-[10px] border border-red-800">
                        {activeSOS.length} Active
                    </span>
                  </div>
                  <div className="p-2 space-y-2">
                      {activeSOS.length === 0 ? (
                          <div className="p-4 text-center text-slate-500 text-xs">No active SOS incidents reported.</div>
                      ) : (
                          activeSOS.map(incident => (
                              <div key={incident.id} className="p-3 bg-slate-900/50 rounded-lg border border-red-900/30 flex justify-between items-center">
                                  <div>
                                      <div className="text-sm font-bold text-slate-200">{incident.type}</div>
                                      <div className="text-xs text-slate-400">{incident.caller} • {incident.location}</div>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-xs font-mono text-red-400">{incident.timeReported}</div>
                                      <div className="text-[10px] text-slate-500">{incident.status}</div>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-sm">System Health</h3>
                    <span className="px-2 py-0.5 rounded bg-green-900/50 text-green-400 text-[10px] border border-green-800">Operational</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Server Load</span>
                        <span className="text-blue-400">45%</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full">
                        <div className="bg-blue-500 h-1.5 rounded-full w-[45%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
            </>
        )}

        {activeTab === 'USERS' && (
            <div className="space-y-4">
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search users by name or email..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                            />
                        </div>
                        <button 
                            onClick={() => setShowAddUser(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-xl transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                            <select 
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg pl-8 pr-2 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none"
                            >
                                <option value="ALL">All Roles</option>
                                <option value="TOURIST">Tourist</option>
                                <option value="STAFF">Staff</option>
                                <option value="RESPONDER">Responder</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div className="relative flex-1">
                             <Activity className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                             <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg pl-8 pr-2 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none"
                            >
                                <option value="ALL">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* User Table */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-700/50 text-xs uppercase font-medium text-slate-400">
                            <tr>
                                <th className="p-3">User</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-6 text-center text-slate-500 text-sm">
                                        No users found matching filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-700/30">
                                        <td className="p-3">
                                            <div className="font-bold text-white">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                            {(user.phone || user.nationality) && (
                                                <div className="text-[10px] text-slate-600 mt-1 flex gap-2">
                                                    {user.phone && <span>{user.phone}</span>}
                                                    {user.nationality && <span>• {user.nationality}</span>}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                                user.role === 'RESPONDER' ? 'bg-red-900/30 border-red-800 text-red-300' :
                                                user.role === 'STAFF' ? 'bg-blue-900/30 border-blue-800 text-blue-300' :
                                                user.role === 'ADMIN' ? 'bg-purple-900/30 border-purple-800 text-purple-300' :
                                                'bg-slate-700 border-slate-600 text-slate-300'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <span className="text-xs">{user.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="text-xs text-slate-500 text-right px-1">
                    Showing {filteredUsers.length} of {allUsers.length} users
                </div>
            </div>
        )}

        {activeTab === 'NOTIFICATIONS' && (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg">Active Safety Advisories</h2>
                    <button 
                        onClick={() => setShowAddAlert(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Post Advisory
                    </button>
                </div>

                <div className="space-y-2">
                    {alerts.length === 0 ? (
                        <div className="text-center p-8 text-slate-500">No active advisories.</div>
                    ) : (
                        alerts.map((alert) => (
                            <div key={alert.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg mt-0.5 ${
                                            alert.severity === 'critical' || alert.severity === 'high' ? 'bg-red-900/30 text-red-400' :
                                            'bg-yellow-900/30 text-yellow-400'
                                        }`}>
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-200">{alert.title}</h3>
                                            <p className="text-xs text-slate-400 mt-1">{alert.details}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
                                                    Location: {alert.location || 'General'}
                                                </span>
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {alert.timestamp}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-green-500 bg-green-900/20 px-2 py-1 rounded text-[10px] font-medium border border-green-900/30">
                                        Active
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {activeTab === 'FACILITIES' && (
            <div className="space-y-6">
                <h2 className="font-bold text-lg">Manage Emergency Facilities</h2>
                
                {/* Add Facility Form */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add New Facility
                    </h3>
                    <form onSubmit={handleAddFacility} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <input 
                                type="text" 
                                placeholder="Facility Name" 
                                value={newFacility.name}
                                onChange={e => setNewFacility({...newFacility, name: e.target.value})}
                                required
                                className="bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                             <input 
                                type="text" 
                                placeholder="Contact Number" 
                                value={newFacility.number}
                                onChange={e => setNewFacility({...newFacility, number: e.target.value})}
                                required
                                className="bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                             <select 
                                value={newFacility.type}
                                onChange={e => setNewFacility({...newFacility, type: e.target.value})}
                                className="bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                                className="bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                            Add Facility
                        </button>
                    </form>
                </div>

                {/* Facilities List */}
                <div className="space-y-2">
                    {facilities.map(facility => (
                        <div key={facility.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                    facility.type === 'Medical' ? 'bg-red-900/30 text-red-400' :
                                    facility.type === 'Fire' ? 'bg-orange-900/30 text-orange-400' :
                                    'bg-blue-900/30 text-blue-400'
                                }`}>
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-200">{facility.name}</div>
                                    <div className="text-xs text-slate-500">{facility.type} • {facility.number}</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeFacility(facility.id)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'PROFILE' && (
            <div className="space-y-6">
                <h2 className="font-bold text-lg">Administrator Profile</h2>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center gap-4">
                    <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
                        {user?.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                        <p className="text-slate-400 text-sm">{user?.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-800">
                            <Shield className="w-3 h-3" /> System Administrator
                        </div>
                    </div>
                </div>

                {user?.allowedRoles && user.allowedRoles.length > 1 && (
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Switch Role</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.allowedRoles.map(role => (
                                <button
                                    key={role}
                                    onClick={() => switchRole(role)}
                                    disabled={role === user.role}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                                        role === user.role 
                                        ? 'bg-purple-600 border-purple-500 text-white' 
                                        : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600 hover:text-white'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <button className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-700 rounded-lg text-slate-300"><Settings className="w-5 h-5" /></div>
                            <span className="text-sm font-medium">System Settings</span>
                        </div>
                        <div className="p-2">
                            <Plus className="w-4 h-4 text-slate-500" />
                        </div>
                    </button>
                    <button onClick={logout} className="w-full bg-slate-800 p-4 rounded-xl border border-red-900/30 flex items-center justify-between hover:bg-red-900/20 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-900/20 rounded-lg text-red-500 group-hover:bg-red-900/30"><LogOut className="w-5 h-5" /></div>
                            <span className="text-sm font-medium text-red-400">Sign Out</span>
                        </div>
                    </button>
                </div>
            </div>
        )}
      </main>

      {/* Post Alert Modal */}
      {showAddAlert && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-800 border border-slate-700 w-full rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold">Post Safety Advisory</h2>
                      <button onClick={() => setShowAddAlert(false)} className="p-1 hover:bg-slate-700 rounded-full">
                          <X className="w-5 h-5 text-slate-400" />
                      </button>
                  </div>
                  <form onSubmit={handleCreateAlert} className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">Title</label>
                          <input 
                              type="text" 
                              className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                              value={newAlert.title}
                              onChange={e => setNewAlert({...newAlert, title: e.target.value})}
                              placeholder="e.g. Flash Flood Warning"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Severity</label>
                              <select 
                                className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={newAlert.severity}
                                onChange={e => setNewAlert({...newAlert, severity: e.target.value})}
                              >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                  <option value="critical">Critical</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                              <input 
                                  type="text" 
                                  className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  value={newAlert.location}
                                  onChange={e => setNewAlert({...newAlert, location: e.target.value})}
                                  placeholder="Affected Area"
                              />
                           </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">Details</label>
                          <textarea 
                              className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                              value={newAlert.details}
                              onChange={e => setNewAlert({...newAlert, details: e.target.value})}
                              placeholder="Describe the advisory..."
                          />
                      </div>
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg mt-2">
                          Post Advisory
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold">Create New User</h2>
                      <button onClick={() => setShowAddUser(false)} className="p-1 hover:bg-slate-700 rounded-full">
                          <X className="w-5 h-5 text-slate-400" />
                      </button>
                  </div>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text" 
                                    className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                    value={newUserForm.name}
                                    onChange={e => setNewUserForm({...newUserForm, name: e.target.value})}
                                    placeholder="e.g. Officer Juan"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="email" 
                                    className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                    value={newUserForm.email}
                                    onChange={e => setNewUserForm({...newUserForm, email: e.target.value})}
                                    placeholder="officer@cebu.gov"
                                    required
                                />
                            </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="tel" 
                                    className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                    value={newUserForm.phone}
                                    onChange={e => setNewUserForm({...newUserForm, phone: e.target.value})}
                                    placeholder="+63 9..."
                                    required
                                />
                            </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Nationality</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                <select 
                                    value={newUserForm.nationality}
                                    onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})}
                                    className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                                >
                                    <option value="">Select</option>
                                    <option value="Filipino">Filipino</option>
                                    <option value="American">American</option>
                                    <option value="South Korean">South Korean</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Sex</label>
                            <select 
                                value={newUserForm.sex}
                                onChange={e => setNewUserForm({...newUserForm, sex: e.target.value})}
                                className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Select Sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Birthdate</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                <input 
                                    type="date"
                                    value={newUserForm.birthdate}
                                    onChange={e => setNewUserForm({...newUserForm, birthdate: e.target.value})}
                                    className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-200"
                                />
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700 mt-2">
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                              <select 
                                className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={newUserForm.role}
                                onChange={e => setNewUserForm({...newUserForm, role: e.target.value})}
                              >
                                  <option value="STAFF">Staff</option>
                                  <option value="RESPONDER">Responder</option>
                                  <option value="ADMIN">Admin</option>
                                  <option value="TOURIST">Tourist</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                              <select 
                                  className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  value={newUserForm.status}
                                  onChange={e => setNewUserForm({...newUserForm, status: e.target.value})}
                              >
                                  <option value="Active">Active</option>
                                  <option value="Suspended">Suspended</option>
                              </select>
                           </div>
                      </div>
                      
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg mt-2">
                          Create Account
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;