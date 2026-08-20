import React, { useState } from 'react';
import { X, MapPin, Navigation, Building, Home, Briefcase, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
}

const POPULAR_AREAS = [
  { city: 'Bengaluru', area: 'Indiranagar, 100ft Road' },
  { city: 'Bengaluru', area: 'Koramangala 5th Block' },
  { city: 'Bengaluru', area: 'HSR Layout Sector 3' },
  { city: 'Bengaluru', area: 'Whitefield Main Road' },
  { city: 'Bengaluru', area: 'Lavelle Road, Central' },
  { city: 'Mumbai', area: 'Bandra West, Pali Hill' },
  { city: 'Delhi', area: 'Connaught Place, Central' },
  { city: 'Hyderabad', area: 'Jubilee Hills, Road No 36' },
];

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const { addresses } = useAuth();
  const { success } = useToast();
  const [customInput, setCustomInput] = useState('');
  const [detecting, setDetecting] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (loc: string) => {
    onSelectLocation(loc);
    success(`Delivering to ${loc}`);
    onClose();
  };

  const handleDetectGPS = () => {
    setDetecting(true);
    setTimeout(() => {
      setDetecting(false);
      handleSelect('Indiranagar, Bengaluru (Current GPS)');
    }, 800);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleSelect(customInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Select Delivery Location</h3>
              <p className="text-xs text-stone-500">Discover restaurants delivering to your doorstep</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Button */}
        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={detecting}
          className="w-full p-3.5 rounded-2xl border-2 border-orange-500 bg-orange-50/50 hover:bg-orange-100/60 text-orange-700 font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs"
        >
          <Navigation className={`w-4 h-4 text-orange-600 ${detecting ? 'animate-spin' : ''}`} />
          <span>{detecting ? 'Detecting your GPS location...' : 'Use Current Location (GPS)'}</span>
        </button>

        {/* Custom Input */}
        <form onSubmit={handleSubmitCustom} className="space-y-2">
          <label htmlFor="custom-address-search" className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Or type your address / area
          </label>
          <div className="flex gap-2">
            <input
              id="custom-address-search"
              type="text"
              placeholder="e.g. Indiranagar, Koramangala, Bandra..."
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-stone-900 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors"
            >
              Set
            </button>
          </div>
        </form>

        {/* Saved Addresses */}
        {addresses.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Your Saved Addresses
            </h4>
            <div className="space-y-2">
              {addresses.map(addr => {
                const fullStr = `${addr.addressLine}, ${addr.street}, ${addr.city}`;
                const isCurrent = currentLocation.includes(addr.street) || currentLocation.includes(addr.addressLine);
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleSelect(`${addr.street}, ${addr.city}`)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white shadow-xs text-stone-700">
                        {addr.label === 'home' ? (
                          <Home className="w-4 h-4 text-emerald-600" />
                        ) : addr.label === 'work' ? (
                          <Briefcase className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Building className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase text-stone-900 tracking-wide">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-stone-200 text-stone-700 font-semibold px-1.5 py-0.2 rounded-sm">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-1">{fullStr}</p>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-orange-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Popular Delivery Hubs */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Popular Food Hubs
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_AREAS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(`${item.area}, ${item.city}`)}
                className="p-2.5 rounded-xl border border-stone-200 hover:border-orange-400 hover:bg-orange-50/50 text-left transition-all text-xs"
              >
                <div className="font-bold text-stone-800 line-clamp-1">{item.area}</div>
                <div className="text-[11px] text-stone-500">{item.city}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
