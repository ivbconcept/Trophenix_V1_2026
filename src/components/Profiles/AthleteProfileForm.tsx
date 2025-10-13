import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AthleteProfileFormProps {
  onSuccess: () => void;
}

export function AthleteProfileForm({ onSuccess }: AthleteProfileFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    photo_url: '',
    sport: '',
    sport_level: '',
    achievements: '',
    professional_history: '',
    geographic_zone: '',
    desired_field: '',
    position_type: '',
    availability: '',
    degrees: '',
    recommendations: '',
    voice_note_url: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) {
        setError('Utilisateur non connecté');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('athlete_profiles')
        .insert({
          user_id: user.id,
          ...formData
        });

      if (insertError) {
        throw insertError;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Profil Sportif
          </h1>
          <p className="text-slate-600 mb-8">
            Complétez votre profil pour le soumettre à validation
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-2">
                  Prénom *
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-2">
                  Nom *
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="photo_url" className="block text-sm font-medium text-slate-700 mb-2">
                URL de la photo de profil
              </label>
              <input
                id="photo_url"
                name="photo_url"
                type="url"
                value={formData.photo_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sport" className="block text-sm font-medium text-slate-700 mb-2">
                  Sport pratiqué *
                </label>
                <input
                  id="sport"
                  name="sport"
                  type="text"
                  value={formData.sport}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="ex: Football, Tennis, Natation..."
                />
              </div>

              <div>
                <label htmlFor="sport_level" className="block text-sm font-medium text-slate-700 mb-2">
                  Niveau *
                </label>
                <select
                  id="sport_level"
                  name="sport_level"
                  value={formData.sport_level}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="International">International</option>
                  <option value="National">National</option>
                  <option value="Régional">Régional</option>
                  <option value="Professionnel">Professionnel</option>
                  <option value="Semi-professionnel">Semi-professionnel</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="achievements" className="block text-sm font-medium text-slate-700 mb-2">
                Palmarès et réussites
              </label>
              <textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Décrivez vos principales réalisations sportives..."
              />
            </div>

            <div>
              <label htmlFor="professional_history" className="block text-sm font-medium text-slate-700 mb-2">
                Historique professionnel
              </label>
              <textarea
                id="professional_history"
                name="professional_history"
                value={formData.professional_history}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Détaillez votre parcours professionnel et sportif..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="geographic_zone" className="block text-sm font-medium text-slate-700 mb-2">
                  Zone géographique
                </label>
                <input
                  id="geographic_zone"
                  name="geographic_zone"
                  type="text"
                  value={formData.geographic_zone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="ex: Paris, Lyon, Remote..."
                />
              </div>

              <div>
                <label htmlFor="desired_field" className="block text-sm font-medium text-slate-700 mb-2">
                  Domaine souhaité
                </label>
                <input
                  id="desired_field"
                  name="desired_field"
                  type="text"
                  value={formData.desired_field}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="ex: Marketing, Commercial, Management..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="position_type" className="block text-sm font-medium text-slate-700 mb-2">
                  Type de poste
                </label>
                <input
                  id="position_type"
                  name="position_type"
                  type="text"
                  value={formData.position_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="ex: CDI, CDD, Stage..."
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-slate-700 mb-2">
                  Disponibilité
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="Immédiate">Immédiate</option>
                  <option value="1 mois">Dans 1 mois</option>
                  <option value="3 mois">Dans 3 mois</option>
                  <option value="6 mois">Dans 6 mois</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="degrees" className="block text-sm font-medium text-slate-700 mb-2">
                Diplômes et formations
              </label>
              <textarea
                id="degrees"
                name="degrees"
                value={formData.degrees}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Listez vos diplômes et formations..."
              />
            </div>

            <div>
              <label htmlFor="recommendations" className="block text-sm font-medium text-slate-700 mb-2">
                Recommandations
              </label>
              <textarea
                id="recommendations"
                name="recommendations"
                value={formData.recommendations}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Ajoutez vos recommandations professionnelles..."
              />
            </div>

            <div>
              <label htmlFor="voice_note_url" className="block text-sm font-medium text-slate-700 mb-2">
                Note vocale de motivation (optionnel)
              </label>
              <input
                id="voice_note_url"
                name="voice_note_url"
                type="url"
                value={formData.voice_note_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="https://example.com/audio.mp3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Soumettre mon profil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
