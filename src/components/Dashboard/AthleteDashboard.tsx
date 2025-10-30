import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, Star, TrendingUp, Award, Heart, ChevronRight, MoreVertical, Play, Newspaper, Building, Users, Video } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
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

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Trending News</h2>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5">
                  <TrendingNewsMain
                    title="Rising Stars: Top Athletes Making Waves in 2025"
                    author="Leonor Davinci"
                    category="Sport"
                    time="2h Ago"
                    image="https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=800"
                    description="Discover the emerging athletes who are breaking records and redefining excellence in their respective sports."
                  />
                </div>

                <div className="col-span-7 space-y-4">
                  <TrendingNewsItem
                    title="Career Transition: From Athlete to Entrepreneur"
                    author="Leonor Davinci"
                    category="Career"
                    time="1h Ago"
                    image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600"
                    isLive
                  />
                  <TrendingNewsItem
                    title="Olympic Training Secrets: How Champions Prepare"
                    author="Leonor Davinci"
                    category="Sport"
                    time="3h Ago"
                    image="https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                  <TrendingNewsItem
                    title="Building Your Personal Brand as an Athlete"
                    author="Leonor Davinci"
                    category="Career"
                    time="4h Ago"
                    image="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Career Management & Development</h2>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5">
                  <TrendingNewsMain
                    title="Navigating Career Transitions: A Guide for Athletes"
                    author="Leonor Davinci"
                    category="Career"
                    time="1h Ago"
                    image="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                    description="Essential strategies for athletes planning their next career move, from networking to skill development."
                  />
                </div>

                <div className="col-span-7 space-y-4">
                  <TrendingNewsItem
                    title="Sponsorship Deals: Maximizing Your Market Value"
                    author="Leonor Davinci"
                    category="Career"
                    time="2h Ago"
                    image="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                  <TrendingNewsItem
                    title="Mental Health in Professional Sports: Breaking the Stigma"
                    author="Leonor Davinci"
                    category="Sport"
                    time="3h Ago"
                    image="https://images.pexels.com/photos/3921045/pexels-photo-3921045.jpeg?auto=compress&cs=tinysrgb&w=600"
                    isLive
                  />
                  <TrendingNewsItem
                    title="Financial Planning for Athletes: Securing Your Future"
                    author="Leonor Davinci"
                    category="Career"
                    time="5h Ago"
                    image="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="col-span-4">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Job Posts</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">More</button>
              </div>
              <div className="space-y-3">
                <JobPostItem
                  icon="briefcase"
                  title="Driver"
                  description="Description for the job"
                  actionType="apply"
                />
                <JobPostItem
                  icon="building"
                  title="Architect"
                  description="Description for the job"
                  salary="250"
                  period="Per day"
                />
                <JobPostItem
                  icon="users"
                  title="Killer"
                  description="Description for the job"
                  salary="120"
                  period="Per day"
                />
                <JobPostItem
                  icon="building"
                  title="Architect"
                  description="Description for the job"
                  salary="250"
                  period="Per day"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Latest news</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">More</button>
              </div>
              <div className="space-y-3">
                <LatestNewsItem
                  title="New Innovations in Driver Assistance Technology"
                  description="Description for the job"
                  date="24 June"
                  image="https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=400"
                  isVideo
                />
                <LatestNewsItem
                  title="New Innovations in Driver Assistance Technology"
                  description="Description for the job"
                  date="24 June"
                  image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400"
                />
              </div>
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

interface JobPostItemProps {
  icon: string;
  title: string;
  description: string;
  actionType?: 'apply';
  salary?: string;
  period?: string;
}

function JobPostItem({ icon, title, description, actionType, salary, period }: JobPostItemProps) {
  const getIcon = () => {
    switch (icon) {
      case 'briefcase':
        return <Briefcase className="w-5 h-5 text-slate-400" />;
      case 'building':
        return <Building className="w-5 h-5 text-slate-400" />;
      case 'users':
        return <Users className="w-5 h-5 text-slate-400" />;
      default:
        return <Briefcase className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 hover:bg-slate-800 transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold mb-1">{title}</h3>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>
        {actionType === 'apply' ? (
          <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">
            Apply
          </button>
        ) : salary ? (
          <div className="text-right flex-shrink-0">
            <div className="text-white font-bold text-lg">{salary}</div>
            <div className="text-slate-400 text-xs">{period}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface LatestNewsItemProps {
  title: string;
  description: string;
  date: string;
  image: string;
  isVideo?: boolean;
}

function LatestNewsItem({ title, description, date, image, isVideo }: LatestNewsItemProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer">
      <div className="flex gap-4 p-4">
        <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {isVideo && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-slate-900 ml-0.5" />
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-slate-500 text-sm mb-2">{description}</p>
          <p className="text-slate-400 text-xs">{date}</p>
        </div>
      </div>
    </div>
  );
}

