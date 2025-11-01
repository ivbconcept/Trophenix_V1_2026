import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, Star, TrendingUp, Award, Heart, ChevronRight, MoreVertical, Play, Newspaper, Mail, Bell } from 'lucide-react';
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
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
                style={{
                  backgroundImage: `url('${backgroundImages[0]}')`,
                  opacity: currentImageIndex === 0 ? 1 : 0
                }}
              ></div>
              <div
                className="absolute inset-0 bg-black/40 transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: currentImageIndex === 0 ? 1 : 0 }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: currentImageIndex === 1 ? 1 : 0 }}
              ></div>
              <div className="relative z-10 transition-opacity duration-[1000ms] ease-in-out" style={{ opacity: currentImageIndex === 0 ? 1 : 0 }}>
                <p className="text-white/90 text-xs font-semibold tracking-wider uppercase mb-4">PLATEFORME TROPHENIX</p>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  Développez Votre Carrière
                </h1>
                <p className="text-white/90 text-base max-w-2xl">
                  Découvrez des opportunités uniques adaptées à votre profil d'athlète
                </p>
              </div>
              <div className="absolute left-10 bottom-10 z-10 transition-opacity duration-[1000ms] ease-in-out" style={{ opacity: currentImageIndex === 1 ? 1 : 0 }}>
                <p className="text-white/90 text-xs font-semibold tracking-wider uppercase mb-4">Jeux Olympiques 2028</p>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Dernières infos</h2>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <TrendingNewsMain
                    title="Réussir sa reconversion : Les clés pour une transition professionnelle réussie"
                    author="Leonor Davinci"
                    category="Gestion de Carrière"
                    time="Il y a 2h"
                    image="https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800"
                    description="Découvrez les étapes essentielles et les stratégies gagnantes pour réussir votre transition du sport de haut niveau vers le monde professionnel."
                  />
                </div>

                <div>
                  <TrendingNewsMain
                    title="Développement de carrière : Les secteurs qui recrutent des profils sportifs"
                    author="Leonor Davinci"
                    category="Business"
                    time="Il y a 2h"
                    image="https://images.pexels.com/photos/936094/pexels-photo-936094.jpeg?auto=compress&cs=tinysrgb&w=600"
                    description="Le marché du travail s'ouvre aux athlètes. Découvrez les opportunités professionnelles et les entreprises qui valorisent vos compétences sportives."
                  />
                </div>

                <div>
                  <TrendingNewsMain
                    title="Formation professionnelle : Préparez votre avenir pendant votre carrière sportive"
                    author="Leonor Davinci"
                    category="Sport"
                    time="Il y a 2h"
                    image="https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=600"
                    description="Les programmes de formation dédiés aux athlètes en activité. Comment acquérir de nouvelles compétences tout en poursuivant votre carrière sportive."
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Toutes les informations</h2>

              <div className="space-y-4">
                <InfoCard
                  title="Stratégies de networking : Comment construire votre réseau professionnel"
                  author="Sophie Martin"
                  category="Réseautage"
                  time="Il y a 5h"
                  image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
                  description="Apprenez à développer et entretenir un réseau professionnel solide qui vous aidera dans votre transition vers le monde de l'entreprise."
                />

                <InfoCard
                  title="Témoignages d'athlètes : Réussites et parcours inspirants après le sport"
                  author="Marc Dubois"
                  category="Inspiration"
                  time="Il y a 8h"
                  image="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800"
                  description="Découvrez les histoires de sportifs de haut niveau qui ont réussi leur reconversion et trouvé leur voie dans différents secteurs."
                />

                <InfoCard
                  title="Les compétences transférables : Valoriser votre expérience sportive"
                  author="Julie Bernard"
                  category="Compétences"
                  time="Il y a 12h"
                  image="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                  description="Identifiez et mettez en valeur les compétences acquises dans le sport qui sont recherchées par les entreprises."
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

