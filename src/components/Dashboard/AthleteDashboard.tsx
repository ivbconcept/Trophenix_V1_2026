import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, Star, TrendingUp, Award } from 'lucide-react';

interface AthleteDashboardProps {
  onNavigate: (view: string) => void;
}

export function AthleteDashboard({ onNavigate }: AthleteDashboardProps) {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bienvenue, {profile?.first_name || 'Athlète'}
          </h1>
          <p className="text-slate-600">
            Gérez votre carrière sportive et trouvez les meilleures opportunités
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            label="Offres disponibles"
            value="24"
            trend="+3 cette semaine"
            onClick={() => onNavigate('job-offers')}
          />
          <StatCard
            icon={FileText}
            label="Candidatures"
            value="5"
            trend="2 en attente"
            onClick={() => onNavigate('my-applications')}
          />
          <StatCard
            icon={MessageSquare}
            label="Messages"
            value="3"
            trend="1 non lu"
            onClick={() => onNavigate('messages')}
          />
          <StatCard
            icon={Star}
            label="Profil vu"
            value="42"
            trend="+12 cette semaine"
            onClick={() => onNavigate('profile')}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard
              icon={Briefcase}
              title="Parcourir les offres"
              description="Découvrez les dernières opportunités"
              onClick={() => onNavigate('job-offers')}
              color="blue"
            />
            <ActionCard
              icon={Award}
              title="Mettre à jour mon profil"
              description="Complétez vos informations"
              onClick={() => onNavigate('profile')}
              color="green"
            />
            <ActionCard
              icon={TrendingUp}
              title="Voir les annuaires"
              description="Connectez avec d'autres"
              onClick={() => onNavigate('athletes-directory')}
              color="purple"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Candidatures récentes</h2>
              <button
                onClick={() => onNavigate('my-applications')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Voir tout
              </button>
            </div>
            <div className="space-y-4">
              <ActivityItem
                title="Coach Sportif"
                subtitle="Club Sportif de Paris"
                status="En attente"
                date="Il y a 2 jours"
              />
              <ActivityItem
                title="Préparateur Physique"
                subtitle="Centre National"
                status="En cours"
                date="Il y a 5 jours"
              />
              <ActivityItem
                title="Conseiller Sport"
                subtitle="Sport Academy"
                status="Vu"
                date="Il y a 1 semaine"
              />
            </div>
          </div>

          {/* Recommended Offers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Offres recommandées</h2>
              <button
                onClick={() => onNavigate('job-offers')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Voir tout
              </button>
            </div>
            <div className="space-y-4">
              <RecommendedOffer
                title="Entraîneur Assistant"
                company="Excellence Sport"
                location="Lyon"
                type="CDI"
              />
              <RecommendedOffer
                title="Responsable Développement"
                company="Sport & Co"
                location="Marseille"
                type="CDD"
              />
              <RecommendedOffer
                title="Consultant Sportif"
                company="Pro Sports"
                location="Toulouse"
                type="Freelance"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  onClick: () => void;
}

function StatCard({ icon: Icon, label, value, trend, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all text-left"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-slate-700" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-600">{label}</p>
        <p className="text-xs text-slate-500">{trend}</p>
      </div>
    </button>
  );
}

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  color: 'blue' | 'green' | 'purple';
}

function ActionCard({ icon: Icon, title, description, onClick, color }: ActionCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <button
      onClick={onClick}
      className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors text-left"
    >
      <div className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </button>
  );
}

interface ActivityItemProps {
  title: string;
  subtitle: string;
  status: string;
  date: string;
}

function ActivityItem({ title, subtitle, status, date }: ActivityItemProps) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1">
        <h4 className="font-medium text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>
      <div className="text-right ml-4">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded">
          {status}
        </span>
        <p className="text-xs text-slate-500 mt-1">{date}</p>
      </div>
    </div>
  );
}

interface RecommendedOfferProps {
  title: string;
  company: string;
  location: string;
  type: string;
}

function RecommendedOffer({ title, company, location, type }: RecommendedOfferProps) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1">
        <h4 className="font-medium text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600">{company}</p>
        <p className="text-xs text-slate-500 mt-1">{location}</p>
      </div>
      <span className="ml-4 px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded">
        {type}
      </span>
    </div>
  );
}
