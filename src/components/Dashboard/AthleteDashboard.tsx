import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, Star, TrendingUp, Award, Heart, ChevronRight, MoreVertical, Play, Newspaper } from 'lucide-react';
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

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Trending News</h2>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5">
                  <TrendingNewsMain
                    title="Flavors & Feasts: Latest Culinary Trends and Savory Delights"
                    author="Leonor Davinci"
                    category="Food & Drink"
                    time="2h Ago"
                    image="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800"
                    description="Explore the newest culinary trends and indulge in mouthwatering delights with our comprehensive coverage of flavors and feasts."
                  />
                </div>

                <div className="col-span-7 space-y-4">
                  <TrendingNewsItem
                    title="Flavors & Feasts: Latest Culinary Trends and Savory Delights"
                    author="Leonor Davinci"
                    category="Business"
                    time="2h Ago"
                    image="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600"
                    isLive
                  />
                  <TrendingNewsItem
                    title="Flavors & Feasts: Latest Culinary Trends and Savory Delights"
                    author="Leonor Davinci"
                    category="Sport"
                    time="2h Ago"
                    image="https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                  <TrendingNewsItem
                    title="Flavors & Feasts: Latest Culinary Trends and Savory Delights"
                    author="Leonor Davinci"
                    category="Technology"
                    time="2h Ago"
                    image="https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Business & Innovation</h2>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5">
                  <TrendingNewsMain
                    title="The Future of Sports Marketing: AI and Digital Transformation"
                    author="Leonor Davinci"
                    category="Business"
                    time="3h Ago"
                    image="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800"
                    description="Discover how artificial intelligence and digital tools are revolutionizing the sports marketing landscape."
                  />
                </div>

                <div className="col-span-7 space-y-4">
                  <TrendingNewsItem
                    title="Startup Spotlight: Revolutionary Training App for Athletes"
                    author="Leonor Davinci"
                    category="Business"
                    time="3h Ago"
                    image="https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                  <TrendingNewsItem
                    title="Nike's New Sustainability Initiative: A Game Changer"
                    author="Leonor Davinci"
                    category="Business"
                    time="4h Ago"
                    image="https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                  <TrendingNewsItem
                    title="Investment Trends in Sports Tech: What's Next?"
                    author="Leonor Davinci"
                    category="Business"
                    time="5h Ago"
                    image="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600"
                    isLive
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Performance & Training</h2>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5">
                  <TrendingNewsMain
                    title="Breaking Records: The Science Behind Elite Athletic Performance"
                    author="Leonor Davinci"
                    category="Sport"
                    time="1h Ago"
                    image="https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=800"
                    description="Explore the cutting-edge science and training methods that are pushing the boundaries of human athletic achievement."
                  />
                </div>

                <div className="col-span-7 space-y-4">
                  <TrendingNewsItem
                    title="Olympic Champions Share Their Training Secrets"
                    author="Leonor Davinci"
                    category="Sport"
                    time="2h Ago"
                    image="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                  <TrendingNewsItem
                    title="Mental Preparation: The Key to Success in Competition"
                    author="Leonor Davinci"
                    category="Sport"
                    time="3h Ago"
                    image="https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=600"
                    isLive
                  />
                  <TrendingNewsItem
                    title="Nutrition Guide for High-Performance Athletes"
                    author="Leonor Davinci"
                    category="Sport"
                    time="4h Ago"
                    image="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Technology & Innovation</h2>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5">
                  <TrendingNewsMain
                    title="Virtual Reality Training: The Next Frontier in Sports"
                    author="Leonor Davinci"
                    category="Technology"
                    time="2h Ago"
                    image="https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=800"
                    description="How VR and AR technologies are transforming the way athletes train and prepare for competition."
                  />
                </div>

                <div className="col-span-7 space-y-4">
                  <TrendingNewsItem
                    title="Wearable Tech: Monitoring Performance in Real-Time"
                    author="Leonor Davinci"
                    category="Technology"
                    time="2h Ago"
                    image="https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                  <TrendingNewsItem
                    title="AI Coaches: The Future of Personalized Training"
                    author="Leonor Davinci"
                    category="Technology"
                    time="3h Ago"
                    image="https://images.pexels.com/photos/8294621/pexels-photo-8294621.jpeg?auto=compress&cs=tinysrgb&w=600"
                  />
                  <TrendingNewsItem
                    title="Blockchain in Sports: New Opportunities for Athletes"
                    author="Leonor Davinci"
                    category="Technology"
                    time="4h Ago"
                    image="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600"
                    isLive
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

