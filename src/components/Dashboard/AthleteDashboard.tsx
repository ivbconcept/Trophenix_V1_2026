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
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="max-w-[1600px] mx-auto px-12 py-8">
        <div className="space-y-8">
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

          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-black text-3xl font-semibold">Trending News</h2>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-400 via-pink-200 to-yellow-300 rounded-3xl p-8 flex flex-col justify-between min-h-[500px]">
                <div className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-green-400 rounded-full"></div>
                      <div className="h-20 w-px bg-gray-300"></div>
                      <div className="space-y-2 flex-1">
                        <div className="flex gap-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-lg"></div>
                          <div className="w-12 h-12 bg-gradient-to-br from-green-300 to-green-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6">
                    <div className="flex gap-4 items-center">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-lg"></div>
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full"></div>
                        </div>
                      </div>
                      <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://i.pravatar.cc/150?img=1"
                      alt="Leonor Davinci"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <span className="text-gray-900 font-medium text-sm">Leonor Davinci</span>
                      <span className="text-gray-600 text-sm mx-2">•</span>
                      <span className="text-gray-600 text-sm">Food & Drink</span>
                    </div>
                    <span className="text-gray-500 text-sm ml-auto">2h Ago</span>
                  </div>
                  <h3 className="text-gray-900 text-2xl font-semibold leading-tight">
                    Flavors & Feasts: Latest Culinary Trends and Savory Delights
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Explore the newest culinary trends and indulge in mouthwatering delights with our comprehensive coverage of flavors and feasts.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer border border-gray-200">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-200 to-blue-200 rounded-xl flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg"></div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            LIVE
                          </div>
                        </div>
                        <h3 className="text-gray-900 font-semibold text-base mb-2 line-clamp-2">
                          Flavors & Feasts: Latest Culinary Trends and Savory Delights
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src="https://i.pravatar.cc/150?img=2"
                          alt="Leonor Davinci"
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-gray-600 text-xs">Leonor Davinci</span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-600 text-xs">Business</span>
                        <span className="text-gray-400 text-xs ml-auto">2h Ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer border border-gray-200">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-300 to-pink-200 rounded-xl flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-gray-900 font-semibold text-base mb-2 line-clamp-2">
                          Flavors & Feasts: Latest Culinary Trends and Savory Delights
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src="https://i.pravatar.cc/150?img=3"
                          alt="Leonor Davinci"
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-gray-600 text-xs">Leonor Davinci</span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-600 text-xs">Sport</span>
                        <span className="text-gray-400 text-xs ml-auto">2h Ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all cursor-pointer border border-gray-200">
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-300 rounded-xl flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg"></div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-gray-900 font-semibold text-base mb-2 line-clamp-2">
                          Flavors & Feasts: Latest Culinary Trends and Savory Delights
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src="https://i.pravatar.cc/150?img=4"
                          alt="Leonor Davinci"
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-gray-600 text-xs">Leonor Davinci</span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-600 text-xs">Technology</span>
                        <span className="text-gray-400 text-xs ml-auto">2h Ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

interface GameModeCardProps {
  title: string;
  description: string;
  image: string;
  badge?: string;
  participants: string[];
  participantCount: number;
}

function GameModeCard({ title, description, image, badge, participants, participantCount }: GameModeCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden hover:bg-[#202020] transition-all cursor-pointer group border border-neutral-800/50">
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-2">
            <Star className="w-3 h-3 fill-white text-white" />
            <span className="text-xs font-light">{badge}</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {participants.map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt=""
                className="w-7 h-7 rounded-full border-2 border-[#1a1a1a]"
              />
            ))}
          </div>
          <div className="bg-amber-400 text-black px-2 py-0.5 rounded-full">
            <span className="text-xs font-semibold">+{participantCount}</span>
          </div>
        </div>
      </div>
      <div className="p-4 pb-5">
        <h3 className="text-white font-normal mb-1 text-lg">
          {title}
        </h3>
        <p className="text-neutral-500 text-sm font-light">
          {description}
        </p>
      </div>
    </div>
  );
}

interface JobCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  salary?: string;
  period?: string;
  action?: string;
  onAction?: () => void;
}

function JobCard({ icon, title, description, salary, period, action, onAction }: JobCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-5 hover:bg-[#202020] transition-all group flex items-center gap-5 border border-neutral-800/30">
      <div className="w-14 h-14 bg-neutral-800/50 rounded-full flex items-center justify-center text-neutral-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-normal mb-1 text-base">
          {title}
        </h3>
        <p className="text-neutral-500 text-sm font-light">
          {description}
        </p>
      </div>
      {action ? (
        <button
          onClick={onAction}
          className="bg-white text-black px-6 py-2 rounded-lg text-sm font-normal hover:bg-neutral-100 transition-colors flex-shrink-0"
        >
          {action}
        </button>
      ) : salary ? (
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-white font-medium text-base">{salary}</div>
            <div className="text-neutral-500 text-xs font-light">{period}</div>
          </div>
          <div className="bg-amber-400 p-2 rounded-lg">
            <div className="w-5 h-5"></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface NewsItemCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
  featured?: boolean;
}

function NewsItemCard({ title, description, image, date, featured }: NewsItemCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden hover:bg-[#202020] transition-all cursor-pointer group border border-neutral-800/30">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        {featured && (
          <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/20">
            <Star className="w-3 h-3 fill-white text-white inline mr-1" />
            <span className="text-xs font-light">Featured</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-white font-normal mb-2 line-clamp-2 leading-snug text-lg">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs font-light">{date}</span>
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
              <ChevronRight className="w-4 h-4 text-white" />
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

