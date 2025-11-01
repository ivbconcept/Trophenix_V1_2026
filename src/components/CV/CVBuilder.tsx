import { useState, useEffect } from 'react';
import { Newspaper, Calendar, Tag } from 'lucide-react';
import { newsService } from '../../services/newsService';
import type { News } from '../../types/news';

const categoryColors: Record<string, string> = {
  annonce: 'bg-blue-100 text-blue-800',
  partenariat: 'bg-green-100 text-green-800',
  technique: 'bg-gray-100 text-gray-800',
  événement: 'bg-orange-100 text-orange-800',
  success: 'bg-yellow-100 text-yellow-800',
  general: 'bg-slate-100 text-slate-800'
};

const categoryLabels: Record<string, string> = {
  annonce: 'Annonce',
  partenariat: 'Partenariat',
  technique: 'Technique',
  événement: 'Événement',
  success: 'Success Story',
  general: 'Général'
};

export default function CVBuilder() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getPublishedNews(10);
      setNews(data);
      setError(null);
    } catch (err) {
      console.error('Error loading news:', err);
      setError('Impossible de charger les actualités');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Actualités</h2>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Actualités</h2>
            </div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Actualités</h1>
          </div>

          <div className="space-y-8">
            {news.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune actualité pour le moment
              </p>
            ) : (
              news.map((item) => (
                <div key={item.id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[item.category] || categoryColors.general}`}>
                      {categoryLabels[item.category] || item.category}
                    </span>
                  </div>

                  <h2 className="font-bold text-gray-900 text-xl mb-3">
                    {item.title}
                  </h2>

                  <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    {item.content}
                  </p>

                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.published_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={loadNews}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium w-full text-center transition-colors py-2 hover:bg-blue-50 rounded-lg"
            >
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
