import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, UserPlus, Info, ArrowLeft, Send, Phone, Globe, ChevronDown, Calendar, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NATIONALITIES = [
  "Filipino", 
  "South Korean", 
  "American", 
  "Japanese", 
  "Chinese", 
  "Australian", 
  "British", 
  "Canadian", 
  "German", 
  "French",
  "Indian",
  "Russian",
  "Other"
];

const AuthScreen: React.FC = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  // Registration Step State (1: Basic Info, 2: Demographics)
  const [regStep, setRegStep] = useState(1);
  
  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [sex, setSex] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [age, setAge] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  // Auto-calculate age when birthdate changes
  useEffect(() => {
    if (birthdate) {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        setAge(calculatedAge.toString());
    }
  }, [birthdate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Login Flow
    if (!isRegistering) {
        if (!email || !password) return;
        setIsLoading(true);
        try {
            await login(email, name); // Login existing user
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setIsLoading(false);
        }
        return;
    }

    // Registration Flow - Step 1
    if (regStep === 1) {
        if (!name || !email || !password || !phone || !nationality) {
            alert("Please fill in all fields to proceed.");
            return;
        }
        setRegStep(2);
        return;
    }

    // Registration Flow - Step 2 (Final)
    if (regStep === 2) {
        if (!sex || !birthdate || !age) {
            alert("Please complete your profile information.");
            return;
        }

        setIsLoading(true);
        try {
            await login(email, name, phone, nationality, sex, parseInt(age), birthdate);
        } catch (error) {
            console.error("Registration failed", error);
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        alert("Please enter your email address first.");
        return;
    }
    
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    alert(`Password reset instructions have been sent to ${email}`);
    setIsResettingPassword(false);
  };

  const toggleMode = () => {
      setIsRegistering(!isRegistering);
      setRegStep(1); // Reset step when switching modes
  };

  return (
    <div className="h-full w-full bg-slate-900 relative flex items-center justify-center p-6 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

        <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl relative z-10 text-white flex flex-col max-h-full overflow-y-auto transition-all duration-300 scrollbar-hide">
            
            {/* Conditional View: Reset Password vs Login/Register */}
            {isResettingPassword ? (
                // --- RESET PASSWORD VIEW ---
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <button 
                        onClick={() => setIsResettingPassword(false)}
                        className="mb-6 flex items-center text-xs text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Sign In
                    </button>

                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
                        <p className="text-slate-300 text-sm mt-1 text-center">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-500 text-white"
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Send Reset Link
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                // --- LOGIN / REGISTER VIEW ---
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex flex-col items-center mb-6 shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">CebuSafeTour</h1>
                        <p className="text-slate-300 text-sm mt-1 text-center">Your companion for a safe and memorable Cebu experience.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegistering && regStep === 2 ? (
                            // --- REGISTRATION STEP 2: DEMOGRAPHICS ---
                            <div className="animate-in slide-in-from-right-8 duration-300 space-y-4">
                                <div className="text-center mb-2">
                                    <h3 className="text-lg font-bold text-white">One last step!</h3>
                                    <p className="text-xs text-slate-400">Tell us a bit more about yourself.</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Sex</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <select 
                                            value={sex}
                                            onChange={(e) => setSex(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-white appearance-none"
                                            required
                                        >
                                            <option value="" disabled className="text-slate-500 bg-slate-800">Select Sex</option>
                                            <option value="Male" className="bg-slate-800">Male</option>
                                            <option value="Female" className="bg-slate-800">Female</option>
                                            <option value="Other" className="bg-slate-800">Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Birthdate</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input 
                                            type="date" 
                                            value={birthdate}
                                            onChange={(e) => setBirthdate(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-white placeholder-slate-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Age</label>
                                    <div className="relative">
                                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="number" 
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-500 text-white"
                                            placeholder="Auto-calculated"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setRegStep(1)}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-[2] bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Complete Setup
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // --- LOGIN OR REGISTRATION STEP 1 ---
                            <>
                                {isRegistering && (
                                    <div className="animate-in slide-in-from-left-8 duration-300 space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-300 ml-1">Full Name</label>
                                            <div className="relative">
                                                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input 
                                                    type="text" 
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-500 text-white"
                                                    placeholder="Juan Dela Cruz"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-slate-300 ml-1">Phone</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input 
                                                        type="tel" 
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-500 text-white"
                                                        placeholder="+63 9..."
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-slate-300 ml-1">Nationality</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                    <select 
                                                        value={nationality}
                                                        onChange={(e) => setNationality(e.target.value)}
                                                        className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-10 pr-8 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-white appearance-none"
                                                        required
                                                    >
                                                        <option value="" disabled className="text-slate-500 bg-slate-800">Select</option>
                                                        {NATIONALITIES.map(nat => (
                                                            <option key={nat} value={nat} className="bg-slate-800 text-white">{nat}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-500 text-white"
                                            placeholder="user@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300 ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-500 text-white"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    {!isRegistering && (
                                        <div className="flex justify-end pt-1">
                                            <button 
                                                type="button"
                                                onClick={() => setIsResettingPassword(true)}
                                                className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {isRegistering ? 'Next' : 'Sign In'}
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </form>

                    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
                            <Info className="w-3 h-3" /> Demo Credentials
                        </div>
                        <div className="space-y-1 text-xs text-slate-400 font-mono">
                            <div className="flex justify-between"><span>Admin:</span> <span className="text-white">admin@cebu.gov</span></div>
                            <div className="flex justify-between"><span>Responder:</span> <span className="text-white">rescue@cebu.gov</span></div>
                            <div className="flex justify-between"><span>Staff:</span> <span className="text-white">staff@cebu.gov</span></div>
                            <div className="flex justify-between"><span>Tourist:</span> <span className="text-white">(Any other email)</span></div>
                        </div>
                    </div>

                    <div className="mt-6 text-center shrink-0">
                        <p className="text-slate-400 text-xs">
                            {isRegistering ? "Already have an account?" : "Don't have an account?"}
                            <button 
                                onClick={toggleMode}
                                className="text-teal-400 font-bold ml-1 hover:text-teal-300 transition-colors"
                            >
                                {isRegistering ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default AuthScreen;