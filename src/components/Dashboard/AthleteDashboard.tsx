import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, Star, TrendingUp, Award, Heart, ChevronRight, MoreVertical, Play } from 'lucide-react';
import { useState } from 'react';

interface AthleteDashboardProps {
  onNavigate: (view: string) => void;
}

export function AthleteDashboard({ onNavigate }: AthleteDashboardProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'sponsoring'>('all');


  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
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

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Vos Opportunités</h2>
                <button className="text-indigo-600 font-medium text-sm hover:text-indigo-700">
                  See all
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'jobs'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Emplois
                </button>
                <button
                  onClick={() => setActiveTab('sponsoring')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'sponsoring'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Sponsoring
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
                    {(activeTab === 'all' || activeTab === 'sponsoring') && (
                      <LessonRow
                        mentorName="Nike France"
                        mentorDate="15/10/2025"
                        type="SPONSORING"
                        typeColor="purple"
                        description="Partenariat Équipement Sportif"
                      />
                    )}
                    {(activeTab === 'all' || activeTab === 'jobs') && (
                      <LessonRow
                        mentorName="Decathlon Pro"
                        mentorDate="18/10/2025"
                        type="EMPLOI"
                        typeColor="blue"
                        description="Manager Commercial - CDI Paris"
                      />
                    )}
                    {(activeTab === 'all' || activeTab === 'sponsoring') && (
                      <LessonRow
                        mentorName="Adidas Team"
                        mentorDate="20/10/2025"
                        type="SPONSORING"
                        typeColor="pink"
                        description="Ambassadeur de Marque"
                      />
                    )}
                  </tbody>
                </table>
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

