import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, Users, MessageSquare, Eye, TrendingUp, Plus, Radio } from 'lucide-react';

interface CompanyDashboardProps {
  onNavigate: (view: string) => void;
}

export function CompanyDashboard({ onNavigate }: CompanyDashboardProps) {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bienvenue, {profile?.company_name || 'Entreprise'}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Gérez vos offres d'emploi et trouvez les meilleurs talents sportifs
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            label="Offres actives"
            value="8"
            trend="3 publiées"
            onClick={() => onNavigate('manage-offers')}
          />
          <StatCard
            icon={Users}
            label="Candidatures"
            value="34"
            trend="12 nouvelles"
            onClick={() => onNavigate('received-applications')}
          />
          <StatCard
            icon={MessageSquare}
            label="Messages"
            value="7"
            trend="2 non lus"
            onClick={() => onNavigate('messages')}
          />
          <StatCard
            icon={Eye}
            label="Vues profil"
            value="156"
            trend="+23 cette semaine"
            onClick={() => onNavigate('profile')}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard
              icon={Plus}
              title="Créer une offre"
              description="Publiez une nouvelle opportunité"
              onClick={() => onNavigate('create-offer')}
              color="blue"
            />
            <ActionCard
              icon={Users}
              title="Parcourir les athlètes"
              description="Trouvez les talents qu'il vous faut"
              onClick={() => onNavigate('athletes-directory')}
              color="green"
            />
            <ActionCard
              icon={TrendingUp}
              title="Voir les statistiques"
              description="Analysez vos performances"
              onClick={() => onNavigate('manage-offers')}
              color="purple"
            />
          </div>
        </div>

        {/* Trending News */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Actualités Sport & Carrière</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <NewsCard
              image="https://images.pexels.com/photos/2182981/pexels-photo-2182981.jpeg?auto=compress&cs=tinysrgb&w=800"
              title="Réussir sa reconversion : 5 clés pour les athlètes de haut niveau"
              description="Découvrez les étapes essentielles pour préparer votre transition vers le monde professionnel après une carrière sportive..."
              category="Carrière"
              date="Il y a 2h"
              isLive={false}
            />
            <NewsCard
              image="https://images.pexels.com/photos/6094047/pexels-photo-6094047.jpeg?auto=compress&cs=tinysrgb&w=800"
              title="Gestion de carrière : Les nouvelles opportunités pour les sportifs"
              description="Le marché du travail s'ouvre aux profils sportifs. Explorez les secteurs qui recrutent des athlètes pour leurs compétences..."
              category="Business"
              date="Il y a 3h"
              isLive={true}
            />
            <NewsCard
              image="https://images.pexels.com/photos/71104/pexels-photo-71104.jpeg?auto=compress&cs=tinysrgb&w=800"
              title="Formation & Développement : Préparez votre avenir dès maintenant"
              description="Les programmes de formation dédiés aux athlètes en transition. Comment acquérir de nouvelles compétences..."
              category="Sport"
              date="Il y a 5h"
              isLive={false}
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
                onClick={() => onNavigate('received-applications')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Voir tout
              </button>
            </div>
            <div className="space-y-4">
              <ApplicationItem
                name="Alexandre Mercier"
                position="Directeur Sportif"
                sport="Basketball"
                date="Il y a 2h"
                status="Nouvelle"
              />
              <ApplicationItem
                name="Julie Rousseau"
                position="Manager de Carrière Athlète"
                sport="Tennis"
                date="Il y a 4h"
                status="Nouvelle"
              />
              <ApplicationItem
                name="Vincent Leblanc"
                position="Consultant Performance Sportive"
                sport="Rugby"
                date="Il y a 6h"
                status="Vue"
              />
            </div>
          </div>

          {/* Active Offers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Offres actives</h2>
              <button
                onClick={() => onNavigate('manage-offers')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Gérer
              </button>
            </div>
            <div className="space-y-4">
              <OfferItem
                title="Coach Reconversion Professionnelle - Athlètes"
                candidates="12"
                views="67"
                daysLeft="15"
              />
              <OfferItem
                title="Conseiller en Gestion de Carrière Sportive"
                candidates="18"
                views="94"
                daysLeft="22"
              />
              <OfferItem
                title="Responsable Développement Talents Sportifs"
                candidates="9"
                views="53"
                daysLeft="10"
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
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </button>
  );
}

interface ApplicationItemProps {
  name: string;
  position: string;
  sport: string;
  date: string;
  status: string;
}

function ApplicationItem({ name, position, sport, date, status }: ApplicationItemProps) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <p className="text-xs text-slate-500">{sport}</p>
          <p className="text-xs text-slate-400">{date}</p>
        </div>
        <h4 className="font-medium text-slate-900 mb-1">{name}</h4>
        <p className="text-sm text-slate-600">{position}</p>
      </div>
      <div className="flex items-start ml-4">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
          status === 'Nouvelle'
            ? 'bg-green-50 text-green-600'
            : 'bg-slate-100 text-slate-600'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}

interface OfferItemProps {
  title: string;
  candidates: string;
  views: string;
  daysLeft: string;
}

function OfferItem({ title, candidates, views, daysLeft }: OfferItemProps) {
  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <h4 className="font-medium text-slate-900 mb-2">{title}</h4>
      <div className="flex items-center space-x-4 text-xs text-slate-600">
        <span className="flex items-center">
          <Users className="w-3 h-3 mr-1" />
          {candidates} candidatures
        </span>
        <span className="flex items-center">
          <Eye className="w-3 h-3 mr-1" />
          {views} vues
        </span>
        <span className="text-slate-500">
          {daysLeft} jours restants
        </span>
      </div>
    </div>
  );
}

interface NewsCardProps {
  image: string;
  title: string;
  description: string;
  category: string;
  date: string;
  isLive: boolean;
}

function NewsCard({ image, title, description, category, date, isLive }: NewsCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden mb-4 aspect-video">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isLive && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Radio className="w-3 h-3" />
            LIVE
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              L
            </div>
            <span className="text-sm font-medium text-slate-900">Leonor Davinci</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{category}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
