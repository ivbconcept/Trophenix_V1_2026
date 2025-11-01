import { useState } from 'react';
import { User, Trophy, Award, Briefcase, GraduationCap, MapPin, Save, ArrowLeft } from 'lucide-react';

interface CVFormData {
  situation: string;
  achievements: string;
  birth_club: string;
  training_center: string;
  ministerial_list: string;
  athlete_type: string;
  desired_field: string;
  position_type: string;
  availability: string;
  professional_history: string;
  degrees: string;
  geographic_zone: string;
}

interface CVFormProps {
  initialData?: Partial<CVFormData>;
  onSave: (data: CVFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function CVForm({ initialData, onSave, onCancel }: CVFormProps) {
  const [formData, setFormData] = useState<CVFormData>({
    situation: initialData?.situation || '',
    achievements: initialData?.achievements || '',
    birth_club: initialData?.birth_club || '',
    training_center: initialData?.training_center || '',
    ministerial_list: initialData?.ministerial_list || '',
    athlete_type: initialData?.athlete_type || '',
    desired_field: initialData?.desired_field || '',
    position_type: initialData?.position_type || '',
    availability: initialData?.availability || '',
    professional_history: initialData?.professional_history || '',
    degrees: initialData?.degrees || '',
    geographic_zone: initialData?.geographic_zone || ''
  });

  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (field: keyof CVFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave(formData);
    } catch (err) {
      console.error('Error saving CV:', err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { id: 1, title: 'Informations générales', icon: User },
    { id: 2, title: 'Parcours sportif', icon: Trophy },
    { id: 3, title: 'Projet professionnel', icon: Briefcase },
    { id: 4, title: 'Formation & Expérience', icon: GraduationCap }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          )}
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Créer mon CV</h1>
          <p className="text-slate-600">Remplissez les informations pour générer votre CV professionnel</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2 text-center hidden md:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  Informations générales
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Zone géographique
                  </label>
                  <input
                    type="text"
                    value={formData.geographic_zone}
                    onChange={(e) => handleChange('geographic_zone', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Île-de-France, Auvergne-Rhône-Alpes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Situation actuelle <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.situation}
                    onChange={(e) => handleChange('situation', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Décrivez votre situation actuelle : statut, activité, objectifs..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type d'athlète
                  </label>
                  <select
                    value={formData.athlete_type}
                    onChange={(e) => handleChange('athlete_type', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Valide">Valide</option>
                    <option value="Handisport">Handisport</option>
                    <option value="Sport adapté">Sport adapté</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-blue-600" />
                  Parcours sportif
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Palmarès sportif <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) => handleChange('achievements', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    placeholder="Listez vos principaux résultats, titres et compétitions...&#10;Exemple :&#10;- Champion de France 2023&#10;- Médaille d'argent aux Championnats d'Europe 2022&#10;- Participation aux Jeux Olympiques 2021"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Club formateur
                    </label>
                    <input
                      type="text"
                      value={formData.birth_club}
                      onChange={(e) => handleChange('birth_club', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom du club où vous avez débuté"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Centre de formation
                    </label>
                    <input
                      type="text"
                      value={formData.training_center}
                      onChange={(e) => handleChange('training_center', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="INSEP, CREPS, Pôle France..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Liste ministérielle
                  </label>
                  <select
                    value={formData.ministerial_list}
                    onChange={(e) => handleChange('ministerial_list', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Elite">Elite</option>
                    <option value="Senior">Senior</option>
                    <option value="Relève">Relève</option>
                    <option value="Espoir">Espoir</option>
                    <option value="Jeune">Jeune</option>
                    <option value="Collectif National">Collectif National</option>
                    <option value="Aucune">Aucune</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  Projet professionnel
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Domaine souhaité <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.desired_field}
                    onChange={(e) => handleChange('desired_field', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Marketing, Commercial, Management, Communication, RH..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type de poste recherché
                    </label>
                    <select
                      value={formData.position_type}
                      onChange={(e) => handleChange('position_type', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Alternance">Alternance</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Indifférent">Indifférent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Disponibilité
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => handleChange('availability', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Immédiate">Immédiate</option>
                      <option value="Dans 1 mois">Dans 1 mois</option>
                      <option value="Dans 3 mois">Dans 3 mois</option>
                      <option value="Dans 6 mois">Dans 6 mois</option>
                      <option value="À définir">À définir</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  Formation & Expérience
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Formation et diplômes
                  </label>
                  <textarea
                    value={formData.degrees}
                    onChange={(e) => handleChange('degrees', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={5}
                    placeholder="Listez vos diplômes et formations...&#10;Exemple :&#10;- Master Marketing Digital - Université Paris-Dauphine (2023)&#10;- Licence STAPS - Université de Lyon (2021)&#10;- Baccalauréat S - Lycée Voltaire (2018)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expérience professionnelle
                  </label>
                  <textarea
                    value={formData.professional_history}
                    onChange={(e) => handleChange('professional_history', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    placeholder="Décrivez vos expériences professionnelles...&#10;Exemple :&#10;Stage Marketing - Nike France (6 mois, 2023)&#10;- Participation aux campagnes digitales&#10;- Analyse des performances social media&#10;&#10;Ambassadeur - Adidas (2020-2023)&#10;- Représentation de la marque lors d'événements"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Conseil :</strong> Mettez en avant vos compétences transférables acquises dans le sport (leadership, gestion du stress, travail d'équipe, discipline, persévérance).
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            <div className="flex gap-3">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Enregistrement...' : 'Enregistrer mon CV'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">
              Étape {currentStep} sur {steps.length}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
