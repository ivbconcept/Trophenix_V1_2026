import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

interface CompanyProfileFormProps {
  onSuccess: () => void;
}

export function CompanyProfileForm({ onSuccess }: CompanyProfileFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    company_name: '',
    logo_url: '',
    sector: '',
    company_size: '',
    location: '',
    hr_contact: '',
    description: ''
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
        .from('company_profiles')
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
            Profil Entreprise
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
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-slate-700 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="logo_url" className="block text-sm font-medium text-slate-700 mb-2">
                Logo de l'entreprise (optionnel)
              </label>
              <input
                id="logo_url"
                name="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-slate-700 mb-2">
                Secteur d'activité *
              </label>
              <input
                id="sector"
                name="sector"
                type="text"
                value={formData.sector}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="ex: Technologie, Finance, Retail..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company_size" className="block text-sm font-medium text-slate-700 mb-2">
                  Taille de l'entreprise
                </label>
                <select
                  id="company_size"
                  name="company_size"
                  value={formData.company_size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="1-10">1-10 employés</option>
                  <option value="11-50">11-50 employés</option>
                  <option value="51-200">51-200 employés</option>
                  <option value="201-500">201-500 employés</option>
                  <option value="501-1000">501-1000 employés</option>
                  <option value="1000+">1000+ employés</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                  Localisation
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="ex: Paris, Lyon, Remote..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="hr_contact" className="block text-sm font-medium text-slate-700 mb-2">
                Email contact RH
              </label>
              <input
                id="hr_contact"
                name="hr_contact"
                type="email"
                value={formData.hr_contact}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="rh@entreprise.com"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description de l'entreprise
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Présentez votre entreprise, sa culture, et ce qui la rend unique..."
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
