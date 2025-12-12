import React from 'react';
import { Attraction } from '../types';
import { ArrowLeft, MapPin, Star, Shield, Share2, Heart, Clock, Navigation, Info, ExternalLink } from 'lucide-react';

interface AttractionDetailProps {
  attraction: Attraction;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const AttractionDetail: React.FC<AttractionDetailProps> = ({ attraction, onBack, isFavorite, onToggleFavorite }) => {
  const getSafetyColor = () => {
    switch (attraction.safetyLevel) {
      case 'Safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'Caution': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High Risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGetDirections = () => {
    // Construct Google Maps URL for directions
    const query = encodeURIComponent(`${attraction.name}, Cebu`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  return (
    <div className="h-full bg-white flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header Image Area */}
      <div className="relative h-64 w-full shrink-0">
        <img 
          src={attraction.imageUrl} 
          alt={attraction.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
        
        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button 
            onClick={onBack}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onToggleFavorite}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors group"
            >
              <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white group-hover:text-red-200'}`} />
            </button>
          </div>
        </div>

        {/* Floating Category Badge */}
        <div className="absolute bottom-4 left-4">
             <span className="px-3 py-1 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold rounded-full shadow-sm">
                {attraction.category}
             </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto bg-white -mt-4 rounded-t-3xl relative z-10 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {/* Title Block */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{attraction.name}</h1>
            <div className="flex items-center text-slate-500 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1 text-teal-500" />
              Cebu Province, Philippines
            </div>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-bold text-slate-800">{attraction.rating}</span>
             </div>
             <span className="text-xs text-slate-400 mt-1">120+ reviews</span>
          </div>
        </div>

        {/* Safety Banner */}
        <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${getSafetyColor()}`}>
           <div className="p-2 bg-white/50 rounded-full shrink-0">
              <Shield className="w-5 h-5" />
           </div>
           <div>
              <h3 className="font-bold text-sm uppercase tracking-wide opacity-90">Safety Status: {attraction.safetyLevel}</h3>
              <p className="text-xs opacity-80 mt-1 leading-relaxed">
                 {attraction.safetyLevel === 'Safe' && 'Conditions are optimal for visiting. Normal precautions apply.'}
                 {attraction.safetyLevel === 'Caution' && 'Exercise caution due to terrain or weather conditions. Follow local guides.'}
                 {attraction.safetyLevel === 'High Risk' && 'Hazardous conditions reported. Travel not recommended without official authorization.'}
              </p>
           </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <Clock className="w-4 h-4" />
                </div>
                <div>
                    <div className="text-xs text-slate-400">Open</div>
                    <div className="text-sm font-bold text-slate-700">6:00 AM - 5:00 PM</div>
                </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                    <Info className="w-4 h-4" />
                </div>
                <div>
                    <div className="text-xs text-slate-400">Entry Fee</div>
                    <div className="text-sm font-bold text-slate-700">₱ 150.00</div>
                </div>
            </div>
        </div>

        {/* Description */}
        <div className="mb-8">
            <h3 className="font-bold text-slate-800 text-lg mb-2">About</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
                {attraction.description}
                <br /><br />
                Experience the beauty of Cebu with this destination. Ensure you pack appropriate gear and stay hydrated. Local guides are available at the entrance for assistance.
            </p>
        </div>

        {/* Location Map */}
        <div className="mb-8">
            <h3 className="font-bold text-slate-800 text-lg mb-3">Location</h3>
            <div 
                onClick={handleGetDirections}
                className="h-48 bg-blue-50 rounded-xl border border-blue-100 relative overflow-hidden cursor-pointer group"
            >
                 {/* Decorative Map Pattern */}
                 <div className="absolute inset-0 opacity-20" style={{
                     backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
                     backgroundSize: '20px 20px'
                 }}></div>
                 
                 {/* Roads/Path Simulation (CSS) */}
                 <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/50 -rotate-12 transform origin-left"></div>
                 <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-white/50 rotate-12 transform origin-top"></div>

                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative transition-transform duration-300 group-hover:-translate-y-1">
                        <div className="absolute -inset-4 bg-teal-500/20 rounded-full animate-ping"></div>
                        <MapPin className="w-10 h-10 text-teal-600 drop-shadow-lg" />
                    </div>
                 </div>
                 
                 <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur p-3 rounded-lg border border-gray-100 flex justify-between items-center shadow-sm">
                    <div className="text-xs">
                        <div className="font-bold text-slate-700">{attraction.name}</div>
                        <div className="text-slate-500">Cebu Province</div>
                    </div>
                    <div className="bg-teal-50 p-2 rounded-md text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                    </div>
                 </div>
            </div>
        </div>

        {/* Bottom Action Area (Placeholder for spacing) */}
        <div className="h-16"></div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex gap-3 pb-8">
          <button 
            onClick={handleGetDirections}
            className="flex-1 bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
          >
              <Navigation className="w-5 h-5" />
              Get Directions
          </button>
      </div>
    </div>
  );
};

export default AttractionDetail;