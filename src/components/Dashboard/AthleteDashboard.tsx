import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Briefcase, FileText, MessagesSquare, Star, TrendingUp, Award, Heart, ChevronRight, MoreVertical, Play, Newspaper, Mail, Bell, Search, MessageSquareText, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import arenaImage from '../../assets/images/mos-sukjaroenkraisri-vO2XxMeYmnY-unsplash copy copy copy.jpg';
import laImage from '../../assets/images/jc-gellidon-XmYSlYrupL8-unsplash copy.jpg';
import accorLogo from '../../assets/images/1196px-Accor_Logo.png';
import nikeLogo from '../../assets/images/logo_nike-removebg-preview.png';

interface AthleteDashboardProps {
  onNavigate: (view: string) => void;
}

const backgroundImages = [
  arenaImage,
  laImage
];

export function AthleteDashboard({ onNavigate }: AthleteDashboardProps) {
  const { profile } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'sponsoring'>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-sm mb-8 transition-colors">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-[200px] md:max-w-xs lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-slate-300 dark:focus:border-slate-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm md:text-base transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 md:gap-2 ml-3 md:ml-6">
              <button
                onClick={toggleDarkMode}
                className="p-2 md:p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all hover:shadow-sm group"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
                ) : (
                  <Moon className="w-5 h-5 md:w-6 md:h-6 text-slate-600 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                )}
              </button>

              <button className="relative p-2 md:p-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl transition-all hover:shadow-sm group">
                <MessageSquareText className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
                <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>

              <button className="relative p-2 md:p-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl transition-all hover:shadow-sm group">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
                <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>

              <button className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 pr-3 md:pr-4 py-1.5 md:py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces"
                  alt="Profile"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-slate-300"
                />
                <span className="text-slate-900 dark:text-white font-medium text-sm md:text-base hidden sm:inline">
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
                <p className="text-white/90 text-xs font-semibold tracking-wider uppercase mb-4 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-md inline-block">Jeux Olympiques 2028</p>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  Préparez-vous plus sereinement
                </h1>
                <p className="text-white/90 text-lg max-w-2xl leading-relaxed">
                  Trouvez des solutions personnalisées à votre situation
                </p>
              </div>
              <div className="absolute left-10 bottom-10 z-10 transition-opacity duration-[1000ms] ease-in-out" style={{ opacity: currentImageIndex === 1 ? 1 : 0 }}>
                <p className="text-white/90 text-xs font-semibold tracking-wider uppercase mb-4 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-md inline-block">PLATEFORME TROPHENIX</p>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  Développez Votre Carrière
                </h1>
                <p className="text-white/90 text-lg max-w-2xl leading-relaxed">
                  Découvrez des opportunités uniques adaptées à votre profil d'athlète
                </p>
              </div>
              <div className="relative z-10 bg-white rounded-lg px-2 py-2 shadow-lg transition-opacity duration-[1000ms] ease-in-out" style={{ opacity: currentImageIndex === 0 ? 1 : 0 }}>
                <img src={accorLogo} alt="Accor" className="w-16 h-auto" />
              </div>
              <div className="absolute right-10 bottom-10 z-10 bg-white rounded-lg px-2 py-2 shadow-lg transition-opacity duration-[1000ms] ease-in-out" style={{ opacity: currentImageIndex === 1 ? 1 : 0 }}>
                <img src={nikeLogo} alt="Nike" className="w-16 h-auto" />
              </div>
            </div>

          </div>

          <div className="col-span-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold leading-tight text-slate-600 mb-4">Les dernières actus</h2>
              <div className="relative mb-6 flex items-center gap-6">
                <div className="inline-flex bg-slate-100/80 rounded-2xl p-0.5 gap-0.5">
                  <div className="px-4 py-1.5 bg-white text-slate-900 rounded-xl text-sm font-semibold whitespace-nowrap cursor-pointer shadow-sm transition-all">
                    Top
                  </div>
                  <div className="px-4 py-1.5 text-slate-500 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all hover:text-slate-700">
                    Football
                  </div>
                  <div className="px-4 py-1.5 text-slate-500 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all hover:text-slate-700">
                    Basketball
                  </div>
                  <div className="px-4 py-1.5 text-slate-500 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all hover:text-slate-700">
                    Tennis
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
              </div>

              <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="relative h-[400px]">
                    <img
                      src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&h=500&fit=crop"
                      alt="Global Markets"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    <div className="absolute top-8 left-8">
                      <div className="flex items-center gap-3 text-white/90">
                        <span className="text-sm font-semibold">Network</span>
                        <span className="text-sm">|</span>
                        <span className="text-sm">9d ago</span>
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8">
                      <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Global Markets<br />and Enterprise
                      </h2>
                      <p className="text-white/90 text-lg mb-6 max-w-3xl leading-relaxed">
                        To spread the word, the company embarked on a mass marketing drive. TV campaigns launched in the platform's key markets. Nisi dignissim tortor sed quam sed ipsum ut. Dolor sit amet, consectetur adipiscing elit.
                      </p>
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces"
                          alt="Nisi Nyung"
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                        />
                        <span className="text-white font-medium">Nisi Nyung</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex gap-4 p-4 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=160&h=100&fit=crop"
                    alt="News 1"
                    className="w-28 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight mb-2">
                      Jabodebek LRT Instagram Account Offers Cheap Redeem iPhone 14 Pro Max
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>12K Views</span>
                      <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                      <span>15 minutes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex gap-4 p-4 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&h=100&fit=crop"
                    alt="News 2"
                    className="w-28 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight mb-2">
                      PDIP Headquarters Became Material for Volunteer Anger
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>239 Views</span>
                      <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                      <span>20 minutes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex gap-4 p-4 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=160&h=100&fit=crop"
                    alt="News 3"
                    className="w-28 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight mb-2">
                      Video of Chinese-Speaking Police Prepared for Duty at IKN
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>100 Views</span>
                      <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                      <span>25 minutes</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold leading-tight text-slate-600 mb-6">Toute l'actualité</h2>

              <div className="relative mb-6 flex items-center gap-6">
                <div className="inline-flex bg-slate-100/80 rounded-2xl p-0.5 gap-0.5">
                  <div className="px-4 py-1.5 bg-white text-slate-900 rounded-xl text-sm font-semibold whitespace-nowrap cursor-pointer shadow-sm transition-all">
                    Top
                  </div>
                  <div className="px-4 py-1.5 text-slate-500 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all hover:text-slate-700">
                    Football
                  </div>
                  <div className="px-4 py-1.5 text-slate-500 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all hover:text-slate-700">
                    Basketball
                  </div>
                  <div className="px-4 py-1.5 text-slate-500 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all hover:text-slate-700">
                    Tennis
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-full">
                    <div className="relative h-[400px]">
                      <img
                        src="https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1200"
                        alt="Global Markets"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                      <div className="absolute top-6 left-6">
                        <div className="flex items-center gap-3 text-white/90">
                          <span className="text-xs font-semibold">Network</span>
                          <span className="text-xs">|</span>
                          <span className="text-xs">9d ago</span>
                        </div>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-2xl font-bold text-white mb-3 leading-tight line-clamp-2">
                          Global Markets and Enterprise
                        </h2>
                        <p className="text-white/90 text-sm mb-4 line-clamp-3 leading-relaxed">
                          To spread the word, the company embarked on a mass marketing drive. TV campaigns launched in the platform's key markets.
                        </p>
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces"
                            alt="Nisi Nyung"
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                          />
                          <span className="text-white text-sm font-medium">Nisi Nyung</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-full">
                    <div className="relative h-[400px]">
                      <img
                        src="https://images.pexels.com/photos/3764538/pexels-photo-3764538.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Technology Innovation"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                      <div className="absolute top-6 left-6">
                        <div className="flex items-center gap-3 text-white/90">
                          <span className="text-xs font-semibold">Technology</span>
                          <span className="text-xs">|</span>
                          <span className="text-xs">2d ago</span>
                        </div>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-2xl font-bold text-white mb-3 leading-tight line-clamp-2">
                          Innovation in Digital Sports
                        </h2>
                        <p className="text-white/90 text-sm mb-4 line-clamp-3 leading-relaxed">
                          New technologies are transforming how athletes train and compete at the highest levels of performance.
                        </p>
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=faces"
                            alt="Sarah Johnson"
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                          />
                          <span className="text-white text-sm font-medium">Sarah Johnson</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-full">
                    <div className="relative h-[400px]">
                      <img
                        src="https://images.pexels.com/photos/3621180/pexels-photo-3621180.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Sports Partnership"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                      <div className="absolute top-6 left-6">
                        <div className="flex items-center gap-3 text-white/90">
                          <span className="text-xs font-semibold">Partnership</span>
                          <span className="text-xs">|</span>
                          <span className="text-xs">5d ago</span>
                        </div>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-2xl font-bold text-white mb-3 leading-tight line-clamp-2">
                          Strategic Partnerships for Athletes
                        </h2>
                        <p className="text-white/90 text-sm mb-4 line-clamp-3 leading-relaxed">
                          Building meaningful connections between athletes and brands to create long-term success stories.
                        </p>
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=faces"
                            alt="Michael Chen"
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                          />
                          <span className="text-white text-sm font-medium">Michael Chen</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold leading-tight text-slate-600 mb-6">Documentaires sportifs</h2>

              <div className="relative rounded-3xl overflow-hidden shadow-lg h-[500px] group cursor-pointer">
                <img
                  src="/src/assets/images/gerson-repreza-tNQ2tmQiC6g-unsplash.jpg"
                  alt="The Last Dance"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>


                <div className="absolute bottom-8 left-8 right-[450px]">
                  <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                    The Last Dance
                  </h2>
                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    L'histoire captivante de Michael Jordan et des Chicago Bulls durant leur quête du sixième titre NBA en 1998...
                  </p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-900 font-semibold hover:bg-white transition-all">
                    <FileText className="w-4 h-4" />
                    Reviews
                  </button>
                </div>

                <div className="absolute top-6 right-6 w-[400px] h-[calc(100%-48px)] flex flex-col gap-6">
                  <div className="relative rounded-3xl overflow-hidden shadow-lg flex-1 group">
                    <img
                      src="/src/assets/images/zachary-kadolph-CmwNM-XHM48-unsplash.jpg"
                      alt="Formula 1: Drive to Survive"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                    <div className="absolute bottom-11 left-4 flex gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-white text-xs font-medium hover:bg-white/20 transition-all border border-white/20">
                        <FileText className="w-3 h-3" />
                        Reviews
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-white text-xs font-medium hover:bg-white/20 transition-all border border-white/20">
                        <Play className="w-3 h-3" />
                        Streaming Series
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-base font-bold text-white mb-0 leading-tight">
                        Formula 1: Drive to Survive
                      </h3>
                    </div>
                  </div>

                  <div className="relative rounded-3xl overflow-hidden shadow-lg flex-1 group">
                    <img
                      src="/src/assets/images/susan-flynn-h4d4m2IkBxA-unsplash.jpg"
                      alt="All or Nothing"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                    <div className="absolute bottom-11 left-4 flex gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-white text-xs font-medium hover:bg-white/20 transition-all border border-white/20">
                        <FileText className="w-3 h-3" />
                        Reviews
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-white text-xs font-medium hover:bg-white/20 transition-all border border-white/20">
                        <Play className="w-3 h-3" />
                        Streaming Series
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-base font-bold text-white mb-0 leading-tight">
                        All or Nothing
                      </h3>
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
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
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
        <p className="text-base text-slate-600 line-clamp-2 leading-relaxed">
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
            <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
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

