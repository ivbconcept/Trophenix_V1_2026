import { Trophy, Users, Briefcase, CheckCircle, ArrowRight, Award, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { AgentElea } from './AI/AgentElea';
import { FEATURES } from '../config/features';
import { useState, useEffect } from 'react';

const CARD_IMAGES = [
  'https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/2582932/pexels-photo-2582932.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg?auto=compress&cs=tinysrgb&w=1200'
];

const CARD_DATA = [
  { title: 'Race Series 2025 Now Open', description: 'Embark on the ultimate test of endurance and determination with marathons, where each stride is a journey of self-discovery and achievement.' },
  { title: 'Charity Entries Are Now Open', description: 'Make a difference while pushing your limits. Join our charity program and run for a cause that matters to you.' },
  { title: 'Thanks To All For Completing The Survey', description: 'Your feedback helps us improve and create better experiences for our community. Thank you for your participation.' },
  { title: 'Join Our Community', description: 'Connect with like-minded athletes, share your journey, and be part of something bigger than yourself.' }
];

const SECTORS = [
  'Commercial / Vente', 'Marketing / Communication', 'Management / Direction',
  'Ressources Humaines', 'Finance / Comptabilité', 'Logistique / Supply Chain',
  'Conseil / Stratégie', 'Événementiel', 'Sport Business',
  'Éducation / Formation', 'Santé / Bien-être', 'Digital / Tech',
  'Entrepreneuriat', 'Autre'
];

const LOCATIONS = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille',
  'Nantes', 'Strasbourg', 'Montpellier', 'Nice', 'Rennes',
  'Télétravail complet', 'Flexible / Hybride', 'Toute la France', 'Étranger'
];

const SPORTS = [
  'Athlétisme', 'Natation', 'Football', 'Basketball', 'Tennis', 'Rugby', 'Handball',
  'Volleyball', 'Cyclisme', 'Boxe', 'Judo', 'Karaté', 'Taekwondo', 'Escrime',
  'Gymnastique', 'Haltérophilie', 'Lutte', 'Aviron', 'Canoë-Kayak', 'Voile',
  'Surf', 'Planche à voile', 'Kitesurf', 'Ski alpin', 'Ski de fond', 'Ski freestyle',
  'Snowboard', 'Biathlon', 'Patinage artistique', 'Patinage de vitesse', 'Hockey sur glace',
  'Curling', 'Bobsleigh', 'Luge', 'Skeleton', 'Équitation', 'Pentathlon moderne',
  'Triathlon', 'Golf', 'Tir à l\'arc', 'Tir sportif', 'Badminton', 'Tennis de table',
  'Squash', 'Padel', 'Cricket', 'Baseball', 'Softball', 'Hockey sur gazon',
  'Water-polo', 'Plongeon', 'Natation synchronisée', 'Ultimate Frisbee',
  'Escalade', 'Skateboard', 'BMX', 'VTT', 'Roller', 'Parkour',
  'Course d\'orientation', 'Trail running', 'Marathon', 'Crossfit', 'Powerlifting',
  'Bodybuilding', 'Yoga', 'Pilates', 'Danse sportive', 'Breakdance',
  'Cheerleading', 'Pétanque', 'Bowling', 'Billard', 'Fléchettes', 'Échecs',
  'E-sport', 'Poker sportif', 'Bridge', 'MMA', 'Kick-boxing', 'Muay Thai',
  'Capoeira', 'Krav Maga', 'Aikido', 'Kung Fu', 'Jiu-jitsu brésilien',
  'Sambo', 'Sumo', 'Catch', 'Polo', 'Polo aquatique', 'Crosse (Lacrosse)',
  'Kin-ball', 'Tchoukball', 'Sepak takraw', 'Kabaddi', 'Pétéca',
  'Spikeball', 'Footgolf', 'Disc golf', 'Pickleball', 'Padbol',
  'Sports mécaniques', 'F1', 'Rallye', 'Moto GP', 'Motocross', 'Karting',
  'Drift', 'NASCAR', 'Endurance auto', 'Sports aériens', 'Parachutisme',
  'Parapente', 'Deltaplane', 'Vol à voile', 'Wingsuit', 'Base jump',
  'Sports nautiques', 'Jet-ski', 'Ski nautique', 'Wakeboard', 'Stand up paddle',
  'Rafting', 'Canyoning', 'Plongée sous-marine', 'Apnée', 'Nage en eau libre',
  'Sauvetage côtier', 'Dragon boat', 'Aviron de mer', 'Autre'
];
import augustPhlieger from '../assets/images/august-phlieger-CREqtqgBFcU-unsplash.jpg';
import davideAracri from '../assets/images/davide-aracri-Q2mL8cqqI7E-unsplash.jpg';
import jacekDylag from '../assets/images/jacek-dylag-fZglO1JkwoM-unsplash.jpg';
import jadonJohnson from '../assets/images/jadon-johnson-1wS1AHSvqeg-unsplash.jpg';
import matthieuPetiard from '../assets/images/matthieu-petiard-Pf6e3o0GL4M-unsplash.jpg';
import passeDecisiveLogo from '../assets/images/Logo 2.png';

const SupportersCarousel = () => {
  const [offset, setOffset] = useState(0);

  const supporters = [
    {
      id: 1,
      category: 'Mind & Body',
      title: 'Bodybalance',
      image: 'https://images.pexels.com/photos/5067706/pexels-photo-5067706.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-slate-900/90'
    },
    {
      id: 2,
      category: 'Dance',
      title: 'Zumba',
      image: 'https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-slate-900/90'
    },
    {
      id: 3,
      category: 'Strength & Conditioning',
      title: 'Bodypump',
      image: 'https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-emerald-900/95',
      featured: true
    },
    {
      id: 4,
      category: 'Cardio',
      title: 'Bodystep',
      image: 'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-slate-900/90'
    },
    {
      id: 5,
      category: 'HIIT',
      title: 'HIIT x Power',
      image: 'https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-slate-900/90'
    }
  ];

  const duplicatedSupporters = [...supporters, ...supporters, ...supporters, ...supporters, ...supporters];

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prevOffset) => {
        const cardWidth = 280;
        const totalWidth = cardWidth * supporters.length;
        const newOffset = prevOffset - 1.5;
        if (newOffset < -totalWidth) {
          return newOffset + totalWidth;
        }
        return newOffset;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [supporters.length]);

  const getCardStyle = (basePosition: number) => {
    const cardWidth = 280;
    const xPosition = basePosition + offset;

    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenCenter = viewportWidth / 2;
    const cardCenter = xPosition + (cardWidth / 2);
    const distanceFromCenter = Math.abs(cardCenter - screenCenter);

    let scale = 0.7;
    let opacity = 0.4;
    let zIndex = 5;
    let isCenter = false;

    if (distanceFromCenter < 40) {
      scale = 1.15;
      opacity = 1;
      zIndex = 30;
      isCenter = true;
    } else if (distanceFromCenter < 300) {
      const ratio = (300 - distanceFromCenter) / 260;
      scale = 0.7 + (ratio * 0.45);
      opacity = 0.4 + (ratio * 0.6);
      zIndex = Math.floor(5 + (ratio * 25));
    }

    return { scale, opacity, zIndex, isCenter };
  };

  return (
    <section className="py-20 bg-slate-700 overflow-hidden">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ils nous soutiennent
          </h2>
        </div>

        <div className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0 flex items-center pointer-events-none">
            {duplicatedSupporters.map((supporter, index) => {
              const cardWidth = 280;
              const basePosition = index * cardWidth;
              const style = getCardStyle(basePosition);

              return (
                <div
                  key={`${supporter.id}-${index}`}
                  className="absolute"
                  style={{
                    left: `${basePosition + offset}px`,
                    transform: `scale(${style.scale})`,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                    transition: 'transform 0.25s ease-out, opacity 0.25s ease-out',
                    willChange: 'transform, opacity',
                  }}
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl pointer-events-auto w-64 h-80">
                    <img
                      src={supporter.image}
                      alt={supporter.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${supporter.gradient} to-transparent`}></div>
                    <div className="absolute top-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30">
                        {supporter.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 text-white p-6">
                      <h3 className="font-bold mb-2 text-xl">
                        {supporter.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

interface LandingPageProps {
  onSignUp: () => void;
  onSignIn: () => void;
  onNavigateToInvestors?: () => void;
}

interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'gif';
}


const SPORTS_MEDIA: MediaItem[] = [
  { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80', type: 'image' },
  { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', type: 'image' },
  { url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80', type: 'image' },
  { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', type: 'image' },
  { url: augustPhlieger, type: 'image' },
  { url: davideAracri, type: 'image' },
  { url: jacekDylag, type: 'image' },
  { url: jadonJohnson, type: 'image' },
  { url: matthieuPetiard, type: 'image' }
];

function ProgramSection() {
  const [selectedCard, setSelectedCard] = useState<number | null>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[480px]">
            <img
              src={CARD_IMAGES[currentImageIndex]}
              alt="Program"
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">Our Program & Survey</h3>
              <p className="text-lg text-slate-200">
                {selectedCard !== null ? CARD_DATA[selectedCard].description : 'Click on a card to learn more about our programs and initiatives.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col h-[480px]">
            {CARD_DATA.map((card, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedCard(index);
                  setCurrentImageIndex(index);
                }}
                className={`group relative rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${
                  selectedCard === index ? 'backdrop-blur-md border border-white/20' : 'bg-white'
                } ${selectedCard === index ? 'flex-1 p-5' : 'h-[115px] p-4'} ${index < CARD_DATA.length - 1 ? 'mb-2' : ''} hover:shadow-xl`}
                style={selectedCard === index ? { backgroundColor: '#058fb5' } : undefined}
              >
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold text-base ${
                    selectedCard === index ? 'text-white' : 'text-slate-900'
                  }`}>
                    {card.title}
                  </h4>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${
                    selectedCard === index ? 'bg-white/20 rotate-180' : 'bg-slate-900/10'
                  }`}>
                    <ChevronDown size={14} className={selectedCard === index ? 'text-white' : 'text-slate-900'} />
                  </div>
                </div>
                {selectedCard === index && (
                  <p className="mt-3 text-sm leading-relaxed text-white">
                    {card.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingPage({ onSignUp, onSignIn, onNavigateToInvestors }: LandingPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [opportunityType, setOpportunityType] = useState<'emploi' | 'sponsoring'>('emploi');
  const [jobSearchForm, setJobSearchForm] = useState({
    job: '',
    sector: '',
    location: '',
    positionType: '',
    availability: '',
    name: '',
    email: ''
  });
  const [sponsoringForm, setSponsoringForm] = useState({
    sport: '',
    budget: '',
    duration: '',
    visibility: '',
    name: '',
    email: ''
  });
  const [sectorInput, setSectorInput] = useState('');
  const [showSectorSuggestions, setShowSectorSuggestions] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [sportInput, setSportInput] = useState('');
  const [showSportSuggestions, setShowSportSuggestions] = useState(false);

  const filteredSectors = SECTORS.filter(sector =>
    sector.toLowerCase().includes(sectorInput.toLowerCase())
  );

  const filteredLocations = LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(locationInput.toLowerCase())
  );

  const filteredSports = SPORTS.filter(sport =>
    sport.toLowerCase().includes(sportInput.toLowerCase())
  );

  const handleSectorSelect = (sector: string) => {
    setJobSearchForm(prev => ({ ...prev, sector }));
    setSectorInput(sector);
    setShowSectorSuggestions(false);
  };

  const handleLocationSelect = (location: string) => {
    setJobSearchForm(prev => ({ ...prev, location }));
    setLocationInput(location);
    setShowLocationSuggestions(false);
  };

  const handleSportSelect = (sport: string) => {
    setSponsoringForm(prev => ({ ...prev, sport }));
    setSportInput(sport);
    setShowSportSuggestions(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % SPORTS_MEDIA.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Trophenix</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={onSignUp}
                className="px-3 py-2 text-slate-700 hover:text-blue-600 font-medium transition-colors"
              >
                Postuler
              </button>
              <button
                onClick={onSignUp}
                className="px-3 py-2 text-slate-700 hover:text-blue-600 font-medium transition-colors"
              >
                Recruter
              </button>
              <button
                onClick={onSignUp}
                className="px-3 py-2 text-slate-700 hover:text-blue-600 font-medium transition-colors mr-4"
              >
                Sponsoriser
              </button>
              <button
                onClick={onSignIn}
                className="px-6 py-2 bg-blue-50 text-slate-700 rounded-lg hover:bg-blue-100 font-medium transition-colors mr-4"
              >
                Se connecter
              </button>
              <button
                onClick={onSignUp}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 font-medium transition-all shadow-sm hover:shadow-md"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#FF5D31] to-[#FF8C31] border border-orange-300 rounded-full mb-6">
                <CheckCircle className="h-4 w-4 text-white mr-2" />
                <span className="text-sm font-medium text-white">Nous soutenons le programme Trophasso</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Un seul espace pour gérer <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">votre carrière sportive</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8">
                Trophenix regroupe les outils et l'écosystème sportif dans un seul espace pour optimiser votre réussite.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onSignUp}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Commencer maintenant</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={onSignIn}
                  className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:border-blue-600 hover:text-blue-600 font-semibold text-lg transition-all"
                >
                  Se connecter
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                {SPORTS_MEDIA.map((media, index) => (
                  <div
                    key={media.url}
                    className={`w-full h-full absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
                      index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <video
                        src={media.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt={`Sport ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces" alt="Femme" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" alt="Homme" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                      <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=faces" alt="Femme" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold">Ils/elles nous font confiance</p>
                      <p className="text-sm text-blue-100">★ objectifs pour nos champions</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 inline-block">
                    <p className="text-3xl font-bold">80%</p>
                    <p className="text-sm">sportifs recrutés en 2026</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-200 z-20">
                <p className="text-3xl font-bold text-blue-600">+100</p>
                <p className="text-sm text-slate-600">emplois en 2026</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-4 overflow-hidden relative border-y border-blue-400/50" style={{backgroundColor: '#0490b2'}}>
            <div className="flex relative z-10">
              <div className="animate-scroll-left flex items-center shrink-0">
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Faites une passe D
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Recrutez un sportif
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Offrez un sponsoring
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Faites une passe D
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Recrutez un sportif
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Offrez un sponsoring
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
              </div>
              <div className="animate-scroll-left flex items-center shrink-0" aria-hidden="true">
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Faites une passe D
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Recrutez un sportif
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Offrez un sponsoring
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Faites une passe D
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Recrutez un sportif
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
                <span className="inline-flex items-center text-white text-xl md:text-2xl font-bold px-8 whitespace-nowrap">
                  Offrez un sponsoring
                  <img src={passeDecisiveLogo} alt="Logo 2" className="h-10 w-10 ml-3 inline-block" />
                </span>
              </div>
            </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Notre Réponse aux Défis du Sport</h2>
              <p className="text-xl text-slate-600">Comprendre les enjeux pour mieux y répondre</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Le Problème Actuel</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Difficulté pour les sportifs à trouver des opportunités professionnelles et de sponsoring adaptées</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Manque de visibilité sur les aides et subventions disponibles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Entreprises peinent à identifier et recruter des profils sportifs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Processus de reconversion complexe et fragmenté</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg border border-blue-200">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Pourquoi Trophenix ?</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start">
                    <CheckCircle className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={20} />
                    <span>Plateforme unique dédiée aux sportifs, recruteurs et sponsors</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={20} />
                    <span>Agent IA pour identifier automatiquement vos aides et subventions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={20} />
                    <span>Matching intelligent entre profils sportifs et opportunités</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={20} />
                    <span>Accompagnement complet dans votre reconversion professionnelle</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <ProgramSection />

        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Trouvez votre opportunité en 2 minutes</h2>
              <p className="text-xl text-slate-600">Découvrez les opportunités qui correspondent à votre profil</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6">
                  <h3 className="text-2xl font-bold text-white">Recherche d'opportunité</h3>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setOpportunityType('emploi')}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                        opportunityType === 'emploi'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Trouver un emploi
                    </button>
                    <button
                      onClick={() => setOpportunityType('sponsoring')}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                        opportunityType === 'sponsoring'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Trouver un sponsor
                    </button>
                  </div>
                  {opportunityType === 'emploi' ? (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          value={sectorInput}
                          onChange={(e) => {
                            setSectorInput(e.target.value);
                            setJobSearchForm(prev => ({ ...prev, sector: e.target.value }));
                            setShowSectorSuggestions(true);
                          }}
                          onFocus={() => setShowSectorSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowSectorSuggestions(false), 200)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Domaine d'activité"
                        />
                        {showSectorSuggestions && filteredSectors.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {filteredSectors.map((sector) => (
                              <button
                                key={sector}
                                type="button"
                                onClick={() => handleSectorSelect(sector)}
                                className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors text-sm"
                              >
                                {sector}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={locationInput}
                          onChange={(e) => {
                            setLocationInput(e.target.value);
                            setJobSearchForm(prev => ({ ...prev, location: e.target.value }));
                            setShowLocationSuggestions(true);
                          }}
                          onFocus={() => setShowLocationSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Zone géographique"
                        />
                        {showLocationSuggestions && filteredLocations.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {filteredLocations.map((location) => (
                              <button
                                key={location}
                                type="button"
                                onClick={() => handleLocationSelect(location)}
                                className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors text-sm"
                              >
                                {location}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={jobSearchForm.positionType}
                          onChange={(e) => setJobSearchForm(prev => ({ ...prev, positionType: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-500"
                        >
                          <option value="">Type de poste</option>
                          <option value="cdi">CDI</option>
                          <option value="cdd">CDD</option>
                          <option value="stage">Stage</option>
                          <option value="alternance">Alternance</option>
                          <option value="freelance">Freelance</option>
                          <option value="creation">Création entreprise</option>
                        </select>
                        <select
                          value={jobSearchForm.availability}
                          onChange={(e) => setJobSearchForm(prev => ({ ...prev, availability: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-500"
                        >
                          <option value="">Disponibilité</option>
                          <option value="immediate">Immédiate</option>
                          <option value="1mois">1 mois</option>
                          <option value="3mois">3 mois</option>
                          <option value="6mois">6 mois</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={jobSearchForm.name}
                          onChange={(e) => setJobSearchForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom"
                        />
                        <input
                          type="email"
                          value={jobSearchForm.email}
                          onChange={(e) => setJobSearchForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Mail"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          value={sportInput}
                          onChange={(e) => {
                            setSportInput(e.target.value);
                            setSponsoringForm(prev => ({ ...prev, sport: e.target.value }));
                            setShowSportSuggestions(true);
                          }}
                          onFocus={() => setShowSportSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowSportSuggestions(false), 200)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Sport / Discipline"
                        />
                        {showSportSuggestions && filteredSports.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {filteredSports.map((sport) => (
                              <button
                                key={sport}
                                type="button"
                                onClick={() => handleSportSelect(sport)}
                                className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors text-sm"
                              >
                                {sport}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <select
                        value={sponsoringForm.visibility}
                        onChange={(e) => setSponsoringForm(prev => ({ ...prev, visibility: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-500"
                      >
                        <option value="">Niveau recherché</option>
                        <option value="international">International</option>
                        <option value="national">National</option>
                        <option value="regional">Régional</option>
                        <option value="professionnel">Professionnel</option>
                        <option value="semi-professionnel">Semi-professionnel</option>
                        <option value="amateur-haut-niveau">Amateur haut niveau</option>
                      </select>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={sponsoringForm.budget}
                          onChange={(e) => setSponsoringForm(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-500"
                        >
                          <option value="">Budget</option>
                          <option value="0-5k">0 - 5 000€</option>
                          <option value="5k-20k">5 000 - 20 000€</option>
                          <option value="20k-50k">20 000 - 50 000€</option>
                          <option value="50k+">50 000€+</option>
                        </select>
                        <select
                          value={sponsoringForm.duration}
                          onChange={(e) => setSponsoringForm(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-500"
                        >
                          <option value="">Durée</option>
                          <option value="3mois">3 mois</option>
                          <option value="6mois">6 mois</option>
                          <option value="1an">1 an</option>
                          <option value="pluriannuel">Pluriannuel</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={sponsoringForm.name}
                          onChange={(e) => setSponsoringForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom"
                        />
                        <input
                          type="email"
                          value={sponsoringForm.email}
                          onChange={(e) => setSponsoringForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Mail"
                        />
                      </div>
                    </>
                  )}
                  <button
                    onClick={onSignUp}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    Rechercher des opportunités
                  </button>
                  <p className="text-sm text-slate-500 text-center flex items-center justify-center">
                    <span className="mr-1">🔒</span> Vos données sont sécurisées
                  </p>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-full">
                <img
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Nos experts vous accompagnent"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-3xl font-bold mb-4">Nos experts vous accompagnent</h3>
                  <p className="text-lg text-blue-100 mb-8">
                    Remplissez le formulaire pour découvrir vos opportunités personnalisées
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20" style={{ background: 'linear-gradient(135deg, #fe8a32 0%, #e6671d 50%, #cc4d0a 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Des Avantages et Cas d'Usage Majeurs
              </h2>
              <p className="text-xl text-white/90">
                Des clients prestigieux, des revenus récurrents
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-96">
                  <img
                    src="https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Sportifs"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                    <span className="text-white text-sm font-medium">Sportifs</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Optimisez votre carrière</h3>
                    <p className="text-sm text-blue-100">Emplois, sponsors et reconversion</p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-96">
                  <img
                    src="https://images.pexels.com/photos/3865556/pexels-photo-3865556.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Fédérations & Clubs"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                    <span className="text-white text-sm font-medium">Fédérations & Clubs</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Gérez vos talents</h3>
                    <p className="text-sm text-blue-100">Suivi et développement des athlètes</p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-96">
                  <img
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Marques & Sponsors"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                    <span className="text-white text-sm font-medium">Marques & Sponsors</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Trouvez vos ambassadeurs</h3>
                    <p className="text-sm text-blue-100">Visibilité et partenariats sportifs</p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-96">
                  <img
                    src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Entreprises"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                    <span className="text-white text-sm font-medium">Entreprises</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Recrutez des talents</h3>
                    <p className="text-sm text-blue-100">Profils sportifs de haut niveau</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid md:grid-cols-2 gap-0 items-center relative">
              <div className="relative z-10 pr-12">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  Take Your Game To The Next Level
                </h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                </p>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  Ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                </p>
                <button className="inline-flex items-center px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  About Us
                </button>
              </div>

              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Tennis player"
                  className="w-full h-[600px] object-cover rounded-br-[100px]"
                />
              </div>

              <div className="absolute inset-0 pointer-events-none">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
                  <line x1="45%" y1="0" x2="55%" y2="100%" stroke="#f97316" strokeWidth="6" />
                </svg>
              </div>

              <div className="absolute top-[20%] left-[48%] transform -translate-x-1/2 flex items-center gap-3 pointer-events-none z-20">
                <div className="bg-green-600 rounded-full p-2.5 shadow-2xl">
                  <CheckCircle className="w-5 h-5 text-white" fill="white" />
                </div>
                <div className="transform -rotate-[60deg] origin-left">
                  <span className="text-slate-900 font-bold text-xl tracking-wider whitespace-nowrap">Tennis</span>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none z-20">
                <div className="bg-green-600 rounded-full p-2.5 shadow-2xl">
                  <CheckCircle className="w-5 h-5 text-white" fill="white" />
                </div>
                <div className="transform -rotate-[60deg] origin-left">
                  <span className="text-slate-900 font-bold text-xl tracking-wider whitespace-nowrap">Pickleball</span>
                </div>
              </div>

              <div className="absolute bottom-[20%] left-[52%] transform -translate-x-1/2 flex items-center gap-3 pointer-events-none z-20">
                <div className="bg-green-600 rounded-full p-2.5 shadow-2xl">
                  <CheckCircle className="w-5 h-5 text-white" fill="white" />
                </div>
                <div className="transform -rotate-[60deg] origin-left">
                  <span className="text-slate-900 font-bold text-xl tracking-wider whitespace-nowrap">Cricket</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SupportersCarousel />

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Financement
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Comment ça marche ?
              </h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-md">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Créez votre profil
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Inscrivez-vous en quelques minutes et créez un profil détaillé
                    mettant en valeur votre parcours sportif et vos ambitions professionnelles.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-md">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Validation administrateur
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Votre profil est vérifié par notre équipe pour garantir la qualité
                    et la sécurité de la communauté.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-md">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Connectez-vous et échangez
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Parcourez les profils, entrez en contact avec des recruteurs ou
                    d'autres sportifs, et démarrez votre nouvelle carrière.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/5453828/pexels-photo-5453828.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Expert conseil"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Nos conseillers à votre écoute</h3>
                  <p className="text-blue-100 mb-4">Du lundi au vendredi, 9h-19h</p>
                  <div className="flex items-center text-xl font-semibold">
                    <span className="mr-2">📞</span> 01 23 45 67 89
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Prêt à commencer votre nouvelle carrière ?
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Rejoignez notre communauté de sportifs et de professionnels engagés
                  dans la réussite professionnelle des athlètes.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nom complet*
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Téléphone*
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre téléphone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Code postal*
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="75001"
                    />
                  </div>
                  <button
                    onClick={onSignUp}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    Créer un compte gratuitement
                  </button>
                  <p className="text-sm text-slate-500 text-center flex items-center justify-center">
                    <span className="mr-1">🔒</span> Vos données sont sécurisées
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">Trophenix</span>
              </div>
              <p className="text-slate-400 mb-4 leading-relaxed">
                Expert en aides financières pour la rénovation énergétique et l'installation de pompes à chaleur.
              </p>
              <p className="text-slate-400 text-sm">Du lundi au vendredi : 9h - 19h</p>
              <p className="text-blue-400 font-semibold mt-2">📞 01 23 45 67 89</p>
              <p className="text-blue-400 mt-1">contact@meilleursaides.com</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Nos solutions</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pompe à chaleur air-eau</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pompe à chaleur air-air</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Isolation thermique</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Panneaux solaires</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Informations</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Les aides disponibles</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Nos artisans RGE</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li>
                  <button
                    onClick={onNavigateToInvestors}
                    className="hover:text-blue-400 transition-colors"
                  >
                    Investisseurs
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 text-sm text-slate-400 mb-4 md:mb-0">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Mentions légales
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                RGPD
              </a>
            </div>
            <a
              href="/admin"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg"
            >
              Entrer
            </a>
          </div>
        </div>
      </footer>

      {/* Agent Elea - Accessible sur la page d'accueil */}
      {FEATURES.AGENT_ELEA_ENABLED && (
        <AgentElea
          context={{
            page: 'landing',
            userType: undefined,
          }}
        />
      )}
    </div>
  );
}
