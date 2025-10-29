import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, Star, TrendingUp, Award, Heart, ChevronRight, MoreVertical, Play, Newspaper } from 'lucide-react';
import { useState, useEffect } from 'react';
import arenaImage from '../../assets/images/jc-gellidon-XmYSlYrupL8-unsplash copy.jpg';

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
              <div className="relative z-10 bg-white rounded-xl px-8 py-6 shadow-lg">
                <svg className="w-20 h-20" viewBox="0 0 1000 356" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M232.663 88.667C193.107 111.869 153.551 135.072 113.995 158.274C100.678 166.01 87.3611 173.746 74.0444 181.482C60.7278 189.218 47.4111 196.954 34.0944 204.69C20.7778 212.426 7.46111 220.162 0 225.333L232.663 88.667Z" fill="black"/>
                  <path d="M509.037 21.8333C466.667 66.0833 398.148 147.917 351.852 205.833C340.741 220.833 335.185 236.833 335.185 252.833C335.185 268.833 340.741 280.5 351.852 288C362.963 295.5 379.63 299.667 398.148 299.667C438.519 299.667 494.63 277.333 559.259 229.667L560.222 229L556.667 229.667C523.703 245.667 496.556 254.333 473.333 254.333C459.259 254.333 448.148 250.667 439.481 243.833C430.815 237 426.296 227.167 426.296 214.333C426.296 195.833 434.963 175.333 452.296 152.833C469.63 130.333 492.148 107.667 520.556 85C548.963 62.3333 576.111 44 601.111 30.5C626.111 17 646.667 10 662.963 10C673.704 10 682.963 13.6667 690.37 21C697.778 28.3333 701.481 37.1667 701.481 47.3333C701.481 60.6667 695.926 76.1667 684.815 94C673.704 111.833 659.259 129.5 641.481 147C623.704 164.5 604.222 180.5 583.333 194.667C562.444 208.833 542.593 218.333 523.704 223.333C523.333 226.667 523.333 230 523.333 233C523.333 248.333 527.407 259.667 535.926 266.667C544.444 273.667 557.778 277.167 575.556 277.167C601.852 277.167 630.741 268.5 662.222 251.167C693.704 233.833 722.963 211 750 183L752.222 180.5L756.296 181.167C748.519 199 738.333 215.833 725.926 231.5C713.519 247.167 700.185 260.833 685.926 272.5C671.667 284.167 657.407 293.167 643.333 299.5C629.259 305.833 616.481 309 604.815 309C585.185 309 570 304.333 559.259 294.833C548.519 285.333 543.333 271.333 543.333 252.833C543.333 244.5 544.296 236 546.296 227.5C527.407 239.5 509.63 248.167 493.333 253.5C477.037 258.833 462.407 261.5 449.63 261.5C432.963 261.5 420.185 257.167 411.111 248.333C402.037 239.5 397.407 227.5 397.407 212.5C397.407 193.333 403.333 173 415.185 151.5C427.037 130 442.407 108.5 461.296 87.5C480.185 66.5 499.259 47.8333 518.519 31.5C537.778 15.1667 553.704 3.66667 566.296 0L509.037 21.8333ZM692.778 81.1667C668.889 97.1667 644.444 115.667 619.63 136.5C594.815 157.333 573.333 178.833 555.185 200.833C537.037 222.833 527.963 243 527.963 261.167C528.333 261.167 528.704 261 529.074 260.833C559.259 248.833 589.63 232.167 619.63 210.833C649.63 189.5 676.111 166 699.63 140.5C723.148 115 737.778 91.8333 743.704 71L743.333 70.3333C733.704 67 717.407 66.3333 704.444 66.3333C700.37 66.3333 696.481 72.3333 692.778 81.1667Z" fill="black"/>
                  <path d="M848.148 180.833C842.593 202.5 839.815 220.333 839.815 234.5C839.815 248.667 843.519 259.333 851.111 266.667C858.704 274 870.556 277.667 886.111 277.667C910 277.667 935.926 269 963.889 251.667C991.852 234.333 1000 216.333 1000 180.833L996.296 181.5C973.889 208.833 954.63 227.667 938.333 238.167C922.037 248.667 907.037 254 893.333 254C883.333 254 876.296 251.167 871.667 245.5C867.037 239.833 864.815 231.833 864.815 221.5C864.815 205.833 869.259 185.5 878.148 160.5C887.037 135.5 895.741 113.167 904.259 93.5C912.778 73.8333 920.185 56.8333 926.481 42.5C932.778 28.1667 936.111 18 936.111 12C936.111 9.33333 935.556 7.33333 934.444 6C933.333 4.66667 931.667 4 929.444 4C923.704 4 916.667 8.16667 908.333 16.5C900 24.8333 891.296 36.3333 882.222 51C873.148 65.6667 864.444 82.1667 855.926 100.5C847.407 118.833 840 137.5 833.704 156.5C827.407 175.5 822.963 193.167 820.556 209.5C818.148 225.833 816.852 239 816.852 249C816.852 259 818.148 267 820.556 273C822.963 279 826.296 283.667 830.556 287C834.815 290.333 839.63 292.667 844.815 294C850 295.333 855.185 296 860 296C870 296 879.259 293.5 887.407 288.5C895.556 283.5 902.963 276.833 909.444 268.5C915.926 260.167 921.667 251 926.481 241C931.296 231 935.556 221.167 939.259 211.5L937.778 210.833C933.333 225.5 927.963 238.833 921.852 250.833C915.741 262.833 909.074 272.833 901.852 280.667C894.63 288.5 887.037 294.5 879.259 298.667C871.481 302.833 864 305 856.667 305C847.407 305 839.259 303 832.222 299C825.185 295 819.259 289.667 814.444 283C809.63 276.333 805.926 268.833 803.333 260.5C800.741 252.167 799.444 243.667 799.444 235C799.444 222.333 800.741 207 803.333 189C805.926 171 809.444 152.667 813.889 134C818.333 115.333 823.148 97.3333 828.333 80C833.519 62.6667 838.148 47.6667 842.222 35L848.148 180.833Z" fill="black"/>
                </svg>
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

