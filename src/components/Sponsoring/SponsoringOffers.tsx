import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface SponsoringOffer {
  id: string;
  company_name: string;
  title: string;
  description: string;
  budget_range: string;
  duration: string;
  location: string;
  sport_category: string;
  posted_date: string;
}

export function SponsoringOffers() {
  const [offers, setOffers] = useState<SponsoringOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Offres de Sponsoring</h1>
          <p className="text-slate-600">Découvrez les opportunités de sponsoring disponibles</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une offre de sponsoring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filtres</span>
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            {['all', 'Football', 'Basketball', 'Tennis', 'Athlétisme'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category === 'all' ? 'Tous' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {offers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucune offre disponible</h3>
              <p className="text-slate-600">Les offres de sponsoring apparaîtront ici</p>
            </div>
          ) : (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{offer.title}</h3>
                    <p className="text-slate-600">{offer.company_name}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Actif
                  </span>
                </div>

                <p className="text-slate-700 mb-4">{offer.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">{offer.budget_range}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{offer.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{offer.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">{offer.sport_category}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Postuler
                  </button>
                  <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                    Détails
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
