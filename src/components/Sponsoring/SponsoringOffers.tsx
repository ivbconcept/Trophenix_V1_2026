import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Bookmark, BookmarkCheck, TrendingUp, Handshake } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SponsoringOffer {
  id: string;
  company_id: string;
  company_name: string;
  company_logo: string;
  company_sector: string;
  title: string;
  description: string;
  budget_range: string;
  duration: string;
  location: string;
  sport_category: string;
  status: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export function SponsoringOffers() {
  const { user, profile } = useAuth();
  const [offers, setOffers] = useState<SponsoringOffer[]>([]);
  const [savedOffers, setSavedOffers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<SponsoringOffer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const mockOffers: SponsoringOffer[] = [
        {
          id: '1',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          company_name: 'Nike France',
          company_logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
          company_sector: 'Équipementier Sportif',
          title: 'Partenariat Athlète Running',
          description: 'Nike recherche des athlètes passionnés de course à pied pour représenter la marque lors d\'événements sportifs. Opportunité unique de collaboration avec la marque leader mondiale.',
          location: 'Paris, France',
          budget_range: '15000 - 30000€',
          duration: '12 mois',
          sport_category: 'Athlétisme',
          status: 'active',
          image_url: 'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=800',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          company_name: 'Accor Hotels',
          company_logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Logo_Accor.svg',
          company_sector: 'Hôtellerie',
          title: 'Ambassadeur Sport & Voyage',
          description: 'Groupe hôtelier international recherche des athlètes pour promouvoir nos destinations. Bénéficiez d\'hébergements gratuits et d\'une rémunération attractive.',
          location: 'Lyon, France',
          budget_range: '10000 - 20000€',
          duration: '18 mois',
          sport_category: 'Multi-sports',
          status: 'active',
          image_url: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          company_name: 'Red Bull',
          company_logo: 'https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=800',
          company_sector: 'Boissons énergétiques',
          title: 'Sponsoring Sports Extrêmes',
          description: 'Red Bull cherche des athlètes de sports extrêmes pour rejoindre sa famille d\'athlètes sponsorisés. Package complet incluant équipement et support logistique.',
          location: 'Marseille, France',
          budget_range: '25000 - 50000€',
          duration: '24 mois',
          sport_category: 'Sports Extrêmes',
          status: 'active',
          image_url: 'https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=800',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          company_name: 'Décathlon Pro',
          company_logo: 'https://images.pexels.com/photos/3760856/pexels-photo-3760856.jpeg',
          company_sector: 'Distribution Sportive',
          title: 'Partenariat Multi-Disciplines',
          description: 'Décathlon recherche des athlètes pour tester et promouvoir ses nouveaux produits. Collaboration long terme avec avantages exclusifs.',
          location: 'Bordeaux, France',
          budget_range: '8000 - 15000€',
          duration: '12 mois',
          sport_category: 'Multi-sports',
          status: 'active',
          image_url: 'https://images.pexels.com/photos/3760856/pexels-photo-3760856.jpeg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          company_name: 'Adidas Performance',
          company_logo: 'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=800',
          company_sector: 'Équipementier Sportif',
          title: 'Programme Jeunes Talents',
          description: 'Adidas lance un programme de sponsoring pour jeunes talents prometteurs. Support financier et équipement complet pour votre développement sportif.',
          location: 'Toulouse, France',
          budget_range: '12000 - 25000€',
          duration: '18 mois',
          sport_category: 'Football',
          status: 'active',
          image_url: 'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?auto=compress&cs=tinysrgb&w=800',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '6',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          company_name: 'La Française des Jeux',
          company_logo: 'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg',
          company_sector: 'Jeux et Paris',
          title: 'Ambassadeur Cyclisme',
          description: 'FDJ recherche des cyclistes professionnels pour représenter l\'équipe lors des grandes courses. Package premium avec salaire et bonus de performance.',
          location: 'Nice, France',
          budget_range: '30000 - 60000€',
          duration: '24 mois',
          sport_category: 'Cyclisme',
          status: 'active',
          image_url: 'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setOffers(mockOffers);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveOffer = (offerId: string) => {
    setSavedOffers(prev => {
      const next = new Set(prev);
      if (next.has(offerId)) {
        next.delete(offerId);
      } else {
        next.add(offerId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-700 mb-6">Offres de Sponsoring</h1>

          <div className="mt-0">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Type de sponsoring"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-gray-700 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Lieu"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-gray-700 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <button className="px-8 py-3 bg-white rounded-xl flex items-center gap-2 text-gray-900 font-semibold hover:bg-gray-50 transition-all shadow-sm border border-gray-200">
                <Filter className="w-5 h-5" />
                Filtre
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre disponible</h3>
              <p className="text-gray-600">Essayez de modifier vos filtres de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                  onClick={() => setSelectedOffer(offer)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {offer.company_logo ? (
                          <img src={offer.company_logo} alt={offer.company_name} className="w-full h-full object-cover" />
                        ) : (
                          <Handshake className="w-10 h-10 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                          {offer.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">
                            {offer.company_logo ? (
                              <img src={offer.company_logo} alt={offer.company_name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-blue-400 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {offer.company_name}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">
                          {offer.location}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-medium">
                            {offer.sport_category}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">
                            {offer.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed">
                      {offer.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {offer.budget_range}
                        </p>
                        <p className="text-[10px] text-gray-500">/An</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (profile?.user_type === 'athlete') {
                              toggleSaveOffer(offer.id);
                            }
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={profile?.user_type !== 'athlete'}
                        >
                          {savedOffers.has(offer.id) ? (
                            <BookmarkCheck className="w-5 h-5 text-green-500" />
                          ) : (
                            <Bookmark className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOffer(offer);
                          }}
                          className="px-5 py-2 bg-green-400 text-white rounded-xl text-xs font-medium hover:bg-green-500 transition-colors"
                        >
                          Postuler
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedOffer && (
            <SponsoringDetailModal
              offer={selectedOffer}
              onClose={() => setSelectedOffer(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SponsoringDetailModal({ offer, onClose }: { offer: SponsoringOffer; onClose: () => void }) {
  const { user, profile } = useAuth();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [presentationLetter, setPresentationLetter] = useState('');

  const handleApply = async () => {
    if (!user || !presentationLetter.trim()) return;
    try {
      setApplying(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApplied(true);
      alert('Demande de sponsoring envoyée avec succès !');
    } catch (error) {
      console.error('Error applying:', error);
      alert('Erreur lors de l\'envoi de la demande');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {offer.company_logo ? (
                  <img src={offer.company_logo} alt={offer.company_name} className="w-full h-full object-cover" />
                ) : (
                  <Handshake className="w-8 h-8 text-gray-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{offer.title}</h2>
                <p className="text-base font-medium text-gray-700 mb-2">{offer.company_name}</p>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {offer.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {offer.sport_category}
                  </span>
                </div>
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
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{offer.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Budget</h4>
              <p className="text-gray-700">{offer.budget_range}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Durée</h4>
              <p className="text-gray-700">{offer.duration}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Catégorie</h4>
              <p className="text-gray-700">{offer.sport_category}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Secteur</h4>
              <p className="text-gray-700">{offer.company_sector}</p>
            </div>
          </div>

          {profile?.user_type === 'athlete' && !applied && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Postuler à cette offre</h4>
              <textarea
                placeholder="Lettre de présentation..."
                value={presentationLetter}
                onChange={(e) => setPresentationLetter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
                rows={6}
              />
              <button
                onClick={handleApply}
                disabled={applying || !presentationLetter.trim()}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? 'Envoi...' : 'Envoyer ma demande'}
              </button>
            </div>
          )}

          {applied && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-medium">Vous avez déjà postulé à cette offre de sponsoring</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
