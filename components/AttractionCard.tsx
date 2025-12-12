import React from 'react';
import { Attraction } from '../types';
import { MapPin, ShieldCheck, ShieldAlert, Shield, Heart, Navigation } from 'lucide-react';

interface AttractionCardProps {
  data: Attraction;
  onClick?: (attraction: Attraction) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ data, onClick, isFavorite, onToggleFavorite }) => {
  const getSafetyIcon = () => {
    switch (data.safetyLevel) {
      case 'Safe': return <ShieldCheck className="w-4 h-4 text-green-600" />;
      case 'Caution': return <ShieldAlert className="w-4 h-4 text-yellow-600" />;
      case 'High Risk': return <Shield className="w-4 h-4 text-red-600" />;
    }
  };

  const getSafetyColor = () => {
    switch (data.safetyLevel) {
      case 'Safe': return 'bg-green-100 text-green-800';
      case 'Caution': return 'bg-yellow-100 text-yellow-800';
      case 'High Risk': return 'bg-red-100 text-red-800';
    }
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(`${data.name}, Cebu`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div 
      onClick={() => onClick && onClick(data)}
      className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer relative group"
    >
      <div className="h-40 overflow-hidden relative">
        <img 
            src={data.imageUrl} 
            alt={data.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm z-10">
          ⭐ {data.rating}
        </div>
        {onToggleFavorite && (
          <button 
            onClick={onToggleFavorite}
            className="absolute top-2 left-2 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors z-10"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-800 leading-tight">{data.name}</h3>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" /> Cebu Province
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getSafetyColor()}`}>
            {getSafetyIcon()}
            {data.safetyLevel}
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{data.description}</p>
        
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(data);
            }}
            className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200"
          >
            View Details
          </button>
          <button 
            onClick={handleNavigate}
            className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
            title="Get Directions"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;