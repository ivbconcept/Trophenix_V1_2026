import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, Star, TrendingUp, Award, Heart, ChevronRight, MoreVertical, Play, Newspaper } from 'lucide-react';
import { useState, useEffect } from 'react';
import arenaImage from '../../assets/images/jc-gellidon-XmYSlYrupL8-unsplash.jpg';

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
            <div className="rounded-3xl p-8 text-white mb-6 shadow-lg relative overflow-hidden" style={{ minHeight: '160px' }}>
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
              <div className="relative z-10 h-full flex flex-col justify-center">
                <p className="text-white/90 text-xs font-semibold tracking-wider uppercase mb-3">PLATEFORME TROPHENIX</p>
                <h1 className="text-2xl font-bold leading-tight mb-1">
                  Développez Votre Carrière avec
                </h1>
                <h1 className="text-2xl font-bold leading-tight mb-3">
                  des Opportunités Professionnelles
                </h1>
                <p className="text-white/90 text-sm max-w-2xl mb-4">
                  Découvrez des opportunités uniques adaptées à votre profil d'athlète
                </p>
                <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2 w-fit">
                  Explorer les opportunités
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Opportunités Recommandées</h2>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-600 rotate-180" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <CourseCard
                  tag="CDI"
                  tagColor="blue"
                  title="Responsable Marketing Sportif - Paris"
                  instructor="Nike France"
                  image="https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=600"
                  onClick={() => onNavigate('job-offers')}
                />
                <CourseCard
                  tag="SPONSORING"
                  tagColor="purple"
                  title="Partenariat Ambassadeur 2025-2026"
                  instructor="Adidas Sport"
                  image="https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=600"
                  onClick={() => onNavigate('job-offers')}
                />
                <CourseCard
                  tag="CDD"
                  tagColor="pink"
                  title="Coach Sportif - Centre de Formation"
                  instructor="Decathlon Pro"
                  image="https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=600"
                  onClick={() => onNavigate('job-offers')}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mb-6">
              <div className="col-span-12">
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Actualités Sportives</h2>
                    <button className="text-indigo-600 font-medium text-sm hover:text-indigo-700 flex items-center gap-1">
                      Voir tout <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <NewsCardLarge
                      title="JO Paris 2024 : Un bilan exceptionnel pour la France"
                      date="28 Oct 2025"
                      category="Olympisme"
                      image="https://images.pexels.com/photos/1872887/pexels-photo-1872887.jpeg?auto=compress&cs=tinysrgb&w=600"
                      description="La France termine avec 64 médailles, son meilleur résultat olympique depuis 1900."
                    />
                    <NewsCardLarge
                      title="Record du monde battu sur 100m"
                      date="27 Oct 2025"
                      category="Athlétisme"
                      image="https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=600"
                      description="Le sprinteur américain établit un nouveau record avec 9.58 secondes."
                    />
                    <NewsCardLarge
                      title="Nike prolonge son partenariat avec le PSG"
                      date="26 Oct 2025"
                      category="Business"
                      image="https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600"
                      description="Un contrat historique de 150 millions d'euros par an jusqu'en 2032."
                    />
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

interface CourseCardProps {
  tag: string;
  tagColor: 'blue' | 'purple' | 'pink';
  title: string;
  instructor: string;
  image: string;
  onClick: () => void;
}

function CourseCard({ tag, tagColor, title, instructor, image, onClick }: CourseCardProps) {
  const tagColors = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600'
  };

  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-slate-600" />
        </button>
      </div>
      <div className="p-4">
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${tagColors[tagColor]} mb-2`}>
          {tag}
        </span>
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug">
          {title}
        </h3>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-slate-600">M</span>
          </div>
          <span className="text-xs text-slate-600">{instructor}</span>
          <span className="ml-auto text-xs text-slate-400">Entreprise</span>
        </div>
      </div>
    </button>
  );
}

interface LessonRowProps {
  mentorName: string;
  mentorDate: string;
  type: string;
  typeColor: 'blue' | 'purple' | 'pink';
  description: string;
}

function LessonRow({ mentorName, mentorDate, type, typeColor, description }: LessonRowProps) {
  const typeColors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    pink: 'bg-pink-50 text-pink-600'
  };

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
      <td className="py-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-slate-600">{mentorName.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm">{mentorName}</p>
            <p className="text-xs text-slate-500">{mentorDate}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-2">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${typeColors[typeColor]}`}>
          <Play className="w-3 h-3" />
          {type}
        </span>
      </td>
      <td className="py-4 px-2">
        <p className="text-sm text-slate-600">{description}</p>
      </td>
      <td className="py-4 px-2 text-center">
        <button className="text-indigo-600 hover:text-indigo-700">
          <Play className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

interface NewsCardLargeProps {
  title: string;
  date: string;
  category: string;
  image: string;
  description: string;
}

function NewsCardLarge({ title, date, category, image, description }: NewsCardLargeProps) {
  return (
    <div className="group cursor-pointer bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-indigo-600">
            {category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{date}</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}

