import { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Users, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { CompanyProfile, Profile } from '../../types';

interface CompanyWithProfile extends CompanyProfile {
  profiles: Profile;
}

export default function CompanyDirectory() {
  const [companies, setCompanies] = useState<CompanyWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithProfile | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_profiles')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('profiles.validation_status', 'approved')
        .eq('profiles.user_type', 'company');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      !searchTerm ||
      company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.sector?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector = !sectorFilter || company.sector === sectorFilter;

    return matchesSearch && matchesSector;
  });

  const uniqueSectors = Array.from(new Set(companies.map(c => c.sector).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Annuaire des Entreprises</h1>
        <p className="text-gray-600">Découvrez les entreprises qui recrutent</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom ou secteur..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les secteurs</option>
          {uniqueSectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise trouvée</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCompany(company)}
            >
              <div className="flex items-start gap-4 mb-4">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.company_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {company.company_name}
                  </h3>
                  <p className="text-sm text-gray-600">{company.sector}</p>
                </div>
              </div>

              {company.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </div>
              )}

              {company.company_size && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                  <Users className="h-4 w-4" />
                  {company.company_size} employés
                </div>
              )}

              {company.description && (
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {company.description}
                </p>
              )}

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="h-4 w-4" />
                Contacter
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
}

function CompanyDetailModal({
  company,
  onClose,
}: {
  company: CompanyWithProfile;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.company_name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {company.company_name}
                </h2>
                <p className="text-lg text-gray-600">{company.sector}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {company.location && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Localisation</h3>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </div>
              </div>
            )}

            {company.company_size && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Taille</h3>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="h-4 w-4" />
                  {company.company_size} employés
                </div>
              </div>
            )}

            {company.hr_contact && (
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-1">Contact RH</h3>
                <p className="text-gray-700">{company.hr_contact}</p>
              </div>
            )}
          </div>

          {company.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">À propos</h3>
              <p className="text-gray-700 whitespace-pre-line">{company.description}</p>
            </div>
          )}

          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            <Send className="h-5 w-5" />
            Envoyer un message
          </button>
        </div>
      </div>
    </div>
  );
}
