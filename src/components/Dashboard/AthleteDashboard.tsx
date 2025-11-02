import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessagesSquare, Star, TrendingUp, Award, Heart, ChevronRight, MoreVertical, Play, Newspaper, Mail, Bell, Search, MessageSquareText } from 'lucide-react';
import { useState, useEffect } from 'react';
import arenaImage from '../../assets/images/venti-views-cHRDevKFDBw-unsplash.jpg';
import laImage from '../../assets/images/jc-gellidon-XmYSlYrupL8-unsplash copy.jpg';
import nikeLogo from '../../assets/images/logo_nike-removebg-preview.png';
import allInfoImage from '../../assets/images/all-information-section.png';

interface AthleteDashboardProps {
  onNavigate: (view: string) => void;
}

const backgroundImages = [
  arenaImage,
  laImage
];

export function AthleteDashboard({ onNavigate }: AthleteDashboardProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'sponsoring'>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-50 bg-white shadow-sm mb-8">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-[200px] md:max-w-xs lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-300 text-slate-900 placeholder-slate-400 text-sm md:text-base"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 md:gap-2 ml-3 md:ml-6">
              <button className="relative p-2 md:p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all hover:shadow-sm group">
                <MessageSquareText className="w-5 h-5 md:w-6 md:h-6 text-slate-600 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>

              <button className="relative p-2 md:p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all hover:shadow-sm group">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-slate-600 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>

              <button className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 pr-3 md:pr-4 py-1.5 md:py-2 hover:bg-slate-100 rounded-full transition-colors">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces"
                  alt="Profile"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-slate-300"
                />
                <span className="text-slate-900 font-medium text-sm md:text-base hidden sm:inline">
                  {profile?.first_name || 'Jayson'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-6">

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">

            <div className="rounded-3xl p-10 text-white mb-6 shadow-lg relative overflow-hidden flex items-end justify-between" style={{ minHeight: '291px' }}>
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
                style={{
                  backgroundImage: `url('${backgroundImages[0]}')`,
                  opacity: currentImageIndex === 0 ? 1 : 0
                }}
              ></div>
              <div
                className="absolute inset-0 bg-black/30 transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: currentImageIndex === 0 ? 1 : 0 }}
              ></div>
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
                style={{
                  backgroundImage: `url('${backgroundImages[1]}')`,
                  opacity: currentImageIndex === 1 ? 1 : 0
                }}
              ></div>
              <div
                className="absolute inset-0 bg-black/30 transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: currentImageIndex === 1 ? 1 : 0 }}
              ></div>
              <div className="relative z-10 transition-opacity duration-[1000ms] ease-in-out" style={{ opacity: currentImageIndex === 0 ? 1 : 0 }}>
                <p className="text-white/90 text-xs font-semibold tracking-wider uppercase mb-4 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-md inline-block">PLATEFORME TROPHENIX</p>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  Développez Votre Carrière
                </h1>
                <p className="text-white/90 text-base max-w-2xl">
                  Découvrez des opportunités uniques adaptées à votre profil d'athlète
                </p>
              </div>
              <div className="absolute left-10 bottom-10 z-10 transition-opacity duration-[1000ms] ease-in-out" style={{ opacity: currentImageIndex === 1 ? 1 : 0 }}>
                <p className="text-white/90 text-xs font-semibold tracking-wider uppercase mb-4 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-md inline-block">Jeux Olympiques 2028</p>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  Préparez-vous plus sereinement
                </h1>
                <p className="text-white/90 text-base max-w-2xl">
                  Trouvez des solutions personnalisées à votre situation
                </p>
              </div>
              <div className="relative z-10 bg-white rounded-lg px-2 py-2 shadow-lg">
                <img src={nikeLogo} alt="Nike" className="w-16 h-auto" />
              </div>
            </div>

            <div className="mb-6">
              <img src={allInfoImage} alt="Toutes les informations" className="w-full rounded-3xl shadow-lg" />
            </div>

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

interface InfoCardProps {
  title: string;
  author: string;
  category: string;
  time: string;
  image: string;
  description: string;
}

function InfoCard({ title, author, category, time, image, description }: InfoCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-base font-semibold">{author.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-slate-900">{author}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              <span>{category}</span>
            </div>
          </div>
          <span className="text-sm text-slate-400">{time}</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
          {title}
        </h3>
        <p className="text-base text-slate-600 line-clamp-2">
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
  description?: string;
}

function TrendingNewsItem({ title, author, category, time, image, isLive, description }: TrendingNewsItemProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex gap-4 min-h-[220px]">
      <div className="relative w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden">
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
          {description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {description}
            </p>
          )}
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

