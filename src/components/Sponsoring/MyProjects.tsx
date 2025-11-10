import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, TrendingUp, Calendar, DollarSign, Users, Image as ImageIcon } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  budget_needed: string;
  duration: string;
  target_audience: string;
  status: 'draft' | 'published' | 'active' | 'completed';
  created_at: string;
  views: number;
  interested_sponsors: number;
}

export function MyProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'published':
        return 'Publié';
      case 'active':
        return 'Actif';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-slate-100 text-slate-700';
      case 'published':
        return 'bg-blue-100 text-blue-700';
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes Projets</h1>
            <p className="text-slate-600">Créez et gérez vos propositions de sponsoring</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-4 px-6 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-slate-900">Nouveau projet</div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun projet créé</h3>
              <p className="text-slate-600 mb-6">Créez votre premier projet de sponsoring pour attirer des sponsors</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-4 px-6 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-slate-900" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-slate-900">Nouveau projet</div>
                </div>
              </button>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white/50" />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{project.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">{project.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>{project.budget_needed}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{project.target_audience}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{project.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{project.interested_sponsors}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm">
                      <Edit2 className="w-4 h-4 inline mr-1" />
                      Modifier
                    </button>
                    <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
              <h2 className="text-2xl font-bold text-slate-900">Créer un nouveau projet</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Titre du projet
                </label>
                <input
                  type="text"
                  placeholder="Ex: Préparation aux Jeux Olympiques 2028"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Décrivez votre projet en détail..."
                  className="w-full h-32 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Budget nécessaire
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 50 000€"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Durée
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 12 mois"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Audience cible
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jeunes 18-35 ans, passionnés de sport"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Créer le projet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
