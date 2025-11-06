import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

export function CompetitionsListPage() {
  const [loading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Compétitions Disponibles
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez et participez aux compétitions sportives
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une compétition, un sport, une ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center sm:w-auto w-full"
          >
            <Filter className="w-5 h-5" />
            Filtres
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <p className="text-gray-600">Filtres disponibles prochainement</p>
            </div>
          </div>
        )}

        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Marketplace de Compétitions
          </h3>
          <p className="text-gray-600 mb-4">
            La fonctionnalité complète sera disponible prochainement
          </p>
          <p className="text-sm text-gray-500">
            Base de données et infrastructure créées avec succès
          </p>
        </div>
      </div>
    </div>
  );
}
