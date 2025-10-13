import { useState, useEffect } from 'react';
import { FeatureService } from '../../services/featureService';
import type { FeatureCategory, FeatureFlag, FeatureVersion } from '../../types/features';

export function FeatureFlagsManager() {
  const [categories, setCategories] = useState<FeatureCategory[]>([]);
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [versions, setVersions] = useState<FeatureVersion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, featuresData, versionsData] = await Promise.all([
        FeatureService.getAllCategories(),
        FeatureService.getAllFeatures(),
        FeatureService.getAllVersions()
      ]);

      setCategories(categoriesData);
      setFeatures(featuresData);
      setVersions(versionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (featureId: string, currentStatus: boolean) => {
    setUpdating(featureId);
    try {
      await FeatureService.updateFeatureStatus(featureId, !currentStatus);
      await loadData();
    } catch (error) {
      console.error('Error toggling feature:', error);
      alert('Erreur lors de la mise à jour de la fonctionnalité');
    } finally {
      setUpdating(null);
    }
  };

  const updateRollout = async (featureId: string, percentage: number) => {
    setUpdating(featureId);
    try {
      await FeatureService.updateFeatureRollout(featureId, percentage);
      await loadData();
    } catch (error) {
      console.error('Error updating rollout:', error);
      alert('Erreur lors de la mise à jour du rollout');
    } finally {
      setUpdating(null);
    }
  };

  const setCurrentVersion = async (versionId: string) => {
    try {
      await FeatureService.setCurrentVersion(versionId);
      await loadData();
      alert('Version mise à jour avec succès');
    } catch (error) {
      console.error('Error setting version:', error);
      alert('Erreur lors du changement de version');
    }
  };

  const filteredFeatures = features.filter(f => {
    if (selectedCategory && f.category_id !== selectedCategory) return false;
    if (selectedVersion && f.target_version !== selectedVersion) return false;
    return true;
  });

  const currentVersion = versions.find(v => v.is_current);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Fonctionnalités</h1>
              <p className="text-gray-600 mt-1">
                Version actuelle : <span className="font-semibold text-blue-600">{currentVersion?.version_number || 'N/A'}</span>
              </p>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 Actualiser
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{features.length}</div>
              <div className="text-sm text-gray-600">Fonctionnalités totales</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {features.filter(f => f.is_enabled).length}
              </div>
              <div className="text-sm text-gray-600">Activées</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {features.filter(f => f.is_beta).length}
              </div>
              <div className="text-sm text-gray-600">En beta</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par catégorie
              </label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.display_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par version
              </label>
              <select
                value={selectedVersion || ''}
                onChange={(e) => setSelectedVersion(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les versions</option>
                {versions.map(ver => (
                  <option key={ver.id} value={ver.version_number}>
                    {ver.version_number} - {ver.display_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Fonctionnalités ({filteredFeatures.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFeatures.map((feature) => {
              const category = categories.find(c => c.id === feature.category_id);
              const isUpdating = updating === feature.id;

              return (
                <div key={feature.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {feature.display_name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          feature.is_enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {feature.is_enabled ? '🟢 Activé' : '🔴 Désactivé'}
                        </span>
                        {feature.is_beta && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                            🧪 Beta
                          </span>
                        )}
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          v{feature.target_version}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-2">{feature.description}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {category && (
                          <span>{category.icon} {category.display_name}</span>
                        )}
                        {feature.component_path && (
                          <span>📁 {feature.component_path}</span>
                        )}
                        {feature.route_path && (
                          <span>🔗 {feature.route_path}</span>
                        )}
                      </div>

                      {feature.rollout_percentage < 100 && feature.is_enabled && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">
                              Rollout: {feature.rollout_percentage}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="10"
                              value={feature.rollout_percentage}
                              onChange={(e) => updateRollout(feature.id, parseInt(e.target.value))}
                              disabled={isUpdating}
                              className="flex-1"
                            />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${feature.rollout_percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => toggleFeature(feature.id, feature.is_enabled)}
                        disabled={isUpdating}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          feature.is_enabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isUpdating ? '⏳ ...' : feature.is_enabled ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>

                  {feature.dependencies && feature.dependencies.length > 0 && (
                    <div className="mt-3 text-xs text-gray-500">
                      <span className="font-medium">Dépendances:</span> {feature.dependencies.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestion des Versions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {versions.map(version => (
              <div
                key={version.id}
                className={`p-4 rounded-lg border-2 ${
                  version.is_current
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{version.version_number}</h3>
                  {version.is_current && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-600 text-white">
                      Actuelle
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{version.display_name}</p>
                {!version.is_current && (
                  <button
                    onClick={() => setCurrentVersion(version.id)}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Activer cette version
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
