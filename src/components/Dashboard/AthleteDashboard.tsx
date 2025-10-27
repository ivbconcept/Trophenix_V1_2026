import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, Star, TrendingUp, Award, Heart, ChevronRight, MoreVertical, Play } from 'lucide-react';

interface AthleteDashboardProps {
  onNavigate: (view: string) => void;
}

export function AthleteDashboard({ onNavigate }: AthleteDashboardProps) {
  const { profile } = useAuth();

  const chartData = [
    { label: '1-10 Aug', value: 35 },
    { label: '11-20 Aug', value: 55 },
    { label: '21-30 Aug', value: 45 },
    { label: '31-40 Aug', value: 70 },
    { label: '41-50 Aug', value: 50 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-8 text-white mb-6 shadow-lg">
              <div className="mb-6">
                <p className="text-indigo-100 text-sm font-medium tracking-wider uppercase mb-2">PLATEFORME TROPHENIX</p>
                <h1 className="text-4xl font-bold leading-tight mb-1">
                  Développez Votre Carrière avec
                </h1>
                <h1 className="text-4xl font-bold leading-tight">
                  des Opportunités Professionnelles
                </h1>
              </div>
              <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg">
                Commencer
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Continue Watching</h2>
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
                  tag="OPPORTUNITÉS"
                  tagColor="blue"
                  title="Guide pour Devenir Coach Professionnel"
                  instructor="Leonardo Samsul"
                  image="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
                  onClick={() => onNavigate('job-offers')}
                />
                <CourseCard
                  tag="RECONVERSION"
                  tagColor="purple"
                  title="Optimiser votre Expérience avec la Meilleure Reconversion"
                  instructor="Bayu Salto"
                  image="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=600"
                  onClick={() => onNavigate('profile')}
                />
                <CourseCard
                  tag="NETWORKING"
                  tagColor="pink"
                  title="Développer et Améliorer votre Réseau Professionnel"
                  instructor="Padhang Satrio"
                  image="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600"
                  onClick={() => onNavigate('athletes-directory')}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Vos Opportunités</h2>
                <button className="text-indigo-600 font-medium text-sm hover:text-indigo-700">
                  See all
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase">Entreprise</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase">Type</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase">Description</th>
                      <th className="text-center py-3 px-2 text-xs font-medium text-slate-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <LessonRow
                      mentorName="Nike France"
                      mentorDate="15/10/2025"
                      type="SPONSORING"
                      typeColor="purple"
                      description="Partenariat Équipement Sportif"
                    />
                    <LessonRow
                      mentorName="Decathlon Pro"
                      mentorDate="18/10/2025"
                      type="EMPLOI"
                      typeColor="blue"
                      description="Manager Commercial - CDI Paris"
                    />
                    <LessonRow
                      mentorName="Adidas Team"
                      mentorDate="20/10/2025"
                      type="SPONSORING"
                      typeColor="pink"
                      description="Ambassadeur de Marque"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Statistic</h2>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#6366f1"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${52 * 2 * Math.PI * 0.52} ${52 * 2 * Math.PI}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-indigo-600">52%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Good Morning Jason 🔥</h3>
                <p className="text-sm text-slate-500">Continue your learning to achieve your target!</p>
              </div>

              <div className="space-y-2 mb-6">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-20">{item.label}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all"
                        style={{ width: `${(item.value / maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Your mentor</h2>
                <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition-colors">
                  <span className="text-indigo-600 text-lg">+</span>
                </button>
              </div>

              <div className="space-y-4 mb-4">
                <MentorCard
                  name="Padhang Satrio"
                  image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
                />
                <MentorCard
                  name="Zakir Horizontal"
                  image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
                />
                <MentorCard
                  name="Leonardo Samsul"
                  image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
                />
              </div>

              <button className="w-full text-center text-indigo-600 font-medium text-sm py-2 hover:text-indigo-700">
                See All
              </button>
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
          <span className="ml-auto text-xs text-slate-400">Mentor</span>
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

interface MentorCardProps {
  name: string;
  image: string;
}

function MentorCard({ name, image }: MentorCardProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div>
          <p className="font-medium text-slate-900 text-sm">{name}</p>
          <p className="text-xs text-slate-500">Mentor</p>
        </div>
      </div>
      <button className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1">
        <span className="text-indigo-600">+</span>
        Follow
      </button>
    </div>
  );
}
