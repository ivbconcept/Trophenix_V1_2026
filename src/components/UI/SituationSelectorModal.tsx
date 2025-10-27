import { Modal } from './Modal';
import { ATHLETE_OPTIONS } from '../../constants/onboardingOptions';
import { CheckCircle2 } from 'lucide-react';

interface SituationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (situation: string) => void;
  currentSelection?: string;
}

export function SituationSelectorModal({
  isOpen,
  onClose,
  onSelect,
  currentSelection,
}: SituationSelectorModalProps) {
  const handleSelect = (situation: string) => {
    onSelect(situation);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sélectionnez votre situation">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ATHLETE_OPTIONS.SITUATIONS.map((situation) => (
          <button
            key={situation}
            onClick={() => handleSelect(situation)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              currentSelection === situation
                ? 'border-slate-900 bg-slate-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">{situation}</h3>
                <p className="text-sm text-slate-600">
                  {getDescriptionForSituation(situation)}
                </p>
              </div>
              {currentSelection === situation && (
                <CheckCircle2 className="w-6 h-6 text-slate-900 flex-shrink-0 ml-2" />
              )}
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}

function getDescriptionForSituation(situation: string): string {
  const descriptions: Record<string, string> = {
    'En activité': 'Vous pratiquez actuellement votre sport de haut niveau',
    'En blessure': 'Vous êtes temporairement éloigné de la compétition',
    'En hésitation': 'Vous réfléchissez à votre avenir sportif',
    'En transition': 'Vous préparez votre après-carrière sportive',
    'En reconversion': 'Vous êtes en cours de reconversion professionnelle',
    'Déjà reconverti': 'Vous avez déjà effectué votre reconversion',
  };
  return descriptions[situation] || '';
}
