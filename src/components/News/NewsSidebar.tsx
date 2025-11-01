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

export default function NewsSidebar() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getPublishedNews(5);
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
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Actualités</h2>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Actualités</h2>
      </div>

      <div className="space-y-6">
        {news.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            Aucune actualité pour le moment
          </p>
        ) : (
          news.map((item) => (
            <div key={item.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-start gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[item.category] || categoryColors.general}`}>
                  {categoryLabels[item.category] || item.category}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                {item.title}
              </h3>

              <p className="text-gray-600 text-xs mb-3 line-clamp-3">
                {item.content}
              </p>

              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(item.published_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={loadNews}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium w-full text-center transition-colors"
        >
          Actualiser
        </button>
      </div>
    </div>
  );
}
