import { X, Heart, MessageCircle, Share2, Bookmark, User, Clock, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NewsModalProps {
  article: {
    id: number;
    title: string;
    description: string;
    fullContent: string;
    image: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    likes: number;
    comments: number;
    views: number;
  };
  onClose: () => void;
}

export function NewsModal({ article, onClose }: NewsModalProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ id: number; author: string; text: string; time: string }>>([
    { id: 1, author: 'Marie Dupont', text: 'Article très intéressant, merci pour le partage !', time: 'Il y a 2h' },
    { id: 2, author: 'Thomas Martin', text: 'Exactement ce dont j\'avais besoin pour ma reconversion', time: 'Il y a 5h' }
  ]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([
        { id: comments.length + 1, author: 'Vous', text: comment, time: 'À l\'instant' },
        ...comments
      ]);
      setComment('');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-96">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-sm font-medium mb-4">
              {article.category}
            </span>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views} vues</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
            <div className="flex gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  liked
                    ? 'bg-red-50 text-red-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span className="font-medium">{likeCount}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{comments.length}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Partager</span>
              </button>
            </div>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-lg transition-all ${
                bookmarked
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-slate-600 leading-relaxed mb-6">{article.description}</p>
            <div className="text-slate-700 leading-relaxed whitespace-pre-line">
              {article.fullContent}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Commentaires ({comments.length})
            </h3>

            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  V
                </div>
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Publier
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {c.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{c.author}</span>
                        <span className="text-sm text-slate-500">{c.time}</span>
                      </div>
                      <p className="text-slate-700">{c.text}</p>
                    </div>
                    <div className="flex gap-4 mt-2 ml-4">
                      <button className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                        Répondre
                      </button>
                      <button className="text-sm text-slate-500 hover:text-red-600 transition-colors">
                        Signaler
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
