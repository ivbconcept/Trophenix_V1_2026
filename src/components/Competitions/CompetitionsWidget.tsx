import React from 'react';
import { Trophy, ChevronRight, Search } from 'lucide-react';

export function CompetitionsWidget() {

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Compétitions</h2>
        </div>
        <a
          href="/competitions"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          Voir tout
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="text-center py-8">
        <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 mb-4">
          Marketplace de compétitions disponible prochainement
        </p>
        <a
          href="/competitions"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Search className="w-4 h-4" />
          Découvrir
        </a>
      </div>
    </div>
  );
}
