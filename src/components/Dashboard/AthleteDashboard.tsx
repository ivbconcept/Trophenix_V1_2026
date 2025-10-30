import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, Star, TrendingUp, Award, Heart, ChevronRight, MoreVertical, Play, Newspaper, Users, Compass, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import arenaImage from '../../assets/images/jc-gellidon-XmYSlYrupL8-unsplash copy.jpg';
import nikeLogo from '../../assets/images/logo_nike-removebg-preview.png';

interface AthleteDashboardProps {
  onNavigate: (view: string) => void;
}

const backgroundImages = [
  arenaImage,
  'https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=1200'
];

export function AthleteDashboard({ onNavigate }: AthleteDashboardProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'sponsoring'>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 16000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="rounded-3xl p-10 text-white mb-6 shadow-lg relative overflow-hidden flex items-end justify-between" style={{ minHeight: '291px' }}>
              {currentImageIndex === 0 ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-[3000ms] ease-in-out"
                    style={{ backgroundImage: `url('${backgroundImages[0]}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-[3000ms] ease-in-out"></div>
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 transition-opacity duration-[3000ms] ease-in-out"></div>
              )}
              <div className="relative z-10">
                <p className="text-white/90 text-xs font-semibold tracking-wider uppercase mb-4">PLATEFORME TROPHENIX</p>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  Développez Votre Carrière
                </h1>
                <p className="text-white/90 text-base max-w-2xl">
                  Découvrez des opportunités uniques adaptées à votre profil d'athlète
                </p>
              </div>
              <div className="relative z-10 bg-white rounded-lg px-2 py-2 shadow-lg">
                <img src={nikeLogo} alt="Nike" className="w-16 h-auto" />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Découvrir</h2>
                <button className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Tous les modes
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <ModeCard
                  title="Développement Carrière"
                  description="Mode de gestion de carrière personnalisé"
                  image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
                  badge="Recommandé"
                  participants={[
                    'https://i.pravatar.cc/150?img=1',
                    'https://i.pravatar.cc/150?img=2'
                  ]}
                  participantCount={2}
                />
                <ModeCard
                  title="Recherche Sponsors"
                  description="Trouvez des partenaires et sponsors adaptés"
                  image="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800"
                  participants={[
                    'https://i.pravatar.cc/150?img=3',
                    'https://i.pravatar.cc/150?img=4'
                  ]}
                  participantCount={2}
                />
                <ModeCard
                  title="Reconversion Pro"
                  description="Explorez de nouvelles opportunités professionnelles"
                  image="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                  participants={[
                    'https://i.pravatar.cc/150?img=5',
                    'https://i.pravatar.cc/150?img=6'
                  ]}
                  participantCount={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-100">Offres d'Emploi</h2>
                  <button
                    onClick={() => onNavigate('jobs')}
                    className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Plus
                  </button>
                </div>

                <div className="space-y-4">
                  <JobPostCard
                    icon={<Target className="w-6 h-6" />}
                    title="Consultant Sportif"
                    description="Accompagnement d'athlètes professionnels"
                    action="Postuler"
                    onAction={() => onNavigate('jobs')}
                  />
                  <JobPostCard
                    icon={<Users className="w-6 h-6" />}
                    title="Coach Performance"
                    description="Entraînement et développement athlétique"
                    salary="3500"
                    period="Par mois"
                  />
                  <JobPostCard
                    icon={<Compass className="w-6 h-6" />}
                    title="Ambassadeur de Marque"
                    description="Représentation de marque sportive premium"
                    salary="2800"
                    period="Par mois"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-100">Dernières Actualités</h2>
                  <button className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                    Plus
                  </button>
                </div>

                <div className="space-y-4">
                  <NewsCard
                    title="Nouvelles Technologies d'Entraînement"
                    description="Les innovations qui transforment la performance"
                    image="https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=600"
                    date="24 Juin"
                    featured
                  />
                  <NewsCard
                    title="Stratégies de Reconversion Réussie"
                    description="Découvrez comment réussir votre transition"
                    image="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
                    date="23 Juin"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

interface ModeCardProps {
  title: string;
  description: string;
  image: string;
  badge?: string;
  participants: string[];
  participantCount: number;
}

function ModeCard({ title, description, image, badge, participants, participantCount }: ModeCardProps) {
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden hover:bg-slate-750 transition-all cursor-pointer group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-3 left-3 bg-slate-900/90 text-white px-3 py-1 rounded-full flex items-center gap-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{badge}</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {participants.map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt=""
                className="w-8 h-8 rounded-full border-2 border-slate-800"
              />
            ))}
          </div>
          <div className="bg-yellow-500 text-slate-900 px-2 py-1 rounded-full">
            <span className="text-xs font-bold">+{participantCount}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-100 mb-1">
          {title}
        </h3>
        <p className="text-sm text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

interface JobPostCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  salary?: string;
  period?: string;
  action?: string;
  onAction?: () => void;
}

function JobPostCard({ icon, title, description, salary, period, action, onAction }: JobPostCardProps) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 hover:bg-slate-750 transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-slate-300 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-slate-400 mb-3">
            {description}
          </p>
          {action ? (
            <button
              onClick={onAction}
              className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              {action}
            </button>
          ) : salary ? (
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-full">
                <span className="text-sm font-bold">{salary}</span>
              </div>
              <span className="text-xs text-slate-400">{period}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface NewsCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
  featured?: boolean;
}

function NewsCard({ title, description, image, date, featured }: NewsCardProps) {
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden hover:bg-slate-750 transition-all cursor-pointer group">
      <div className="flex gap-4 p-4">
        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {featured && (
            <div className="absolute top-2 right-2 bg-slate-900/90 text-white p-1.5 rounded-full">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-2 line-clamp-2 leading-snug">
              {title}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-2">
              {description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TrendingNewsMainProps {
  title: string;
  author: string;
  category: string;
  time: string;
  image: string;
  description: string;
}

function TrendingNewsMain({ title, author, category, time, image, description }: TrendingNewsMainProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{author.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">{author}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              <span>{category}</span>
            </div>
          </div>
          <span className="text-xs text-slate-400">{time}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

interface TrendingNewsItemProps {
  title: string;
  author: string;
  category: string;
  time: string;
  image: string;
  isLive?: boolean;
}

function TrendingNewsItem({ title, author, category, time, image, isLive }: TrendingNewsItemProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex gap-4">
      <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {isLive && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold">LIVE</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">{author.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-900">{author}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              <span>{category}</span>
            </div>
          </div>
          <span className="text-xs text-slate-400">{time}</span>
        </div>
      </div>
    </div>
  );
}

