import { Modal } from './Modal';
import { ATHLETE_OPTIONS } from '../../constants/onboardingOptions';
import { CheckCircle2, Search } from 'lucide-react';
import { useState } from 'react';

interface SportSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sport: string) => void;
  currentSelection?: string;
}

export function SportSelectorModal({
  isOpen,
  onClose,
  onSelect,
  currentSelection,
}: SportSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSports = ATHLETE_OPTIONS.SPORTS.filter((sport) =>
    sport.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (sport: string) => {
    onSelect(sport);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sélectionnez votre sport">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un sport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {filteredSports.map((sport) => (
            <button
              key={sport}
              onClick={() => handleSelect(sport)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                currentSelection === sport
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">{sport}</span>
                {currentSelection === sport && (
                  <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 ml-2" />
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredSports.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            Aucun sport trouvé pour "{searchTerm}"
          </div>
        )}
      </div>
    </Modal>
  );
}
