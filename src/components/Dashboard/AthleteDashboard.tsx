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

  const kanbanColumns = [
    {
      id: 'new',
      title: 'Nouvelles pistes',
      count: 3,
      value: '300,00€',
      color: 'orange',
      cards: [
        {
          title: 'Paris 15e, France',
          person: 'Briar House',
          status: 'Rapport complet',
          statusColor: 'green',
          tags: ['Tâches 0/2'],
          time: 'Nouveau',
          updated: 'À l\'instant',
        },
        {
          title: 'Londres Road, Sheffield, UK',
          person: 'Aileen Foley',
          status: 'Rapport complet',
          statusColor: 'green',
          tags: ['Brouillon de proposition'],
          time: '5 jours',
          updated: 'Mise à jour il y a 6 jours',
        },
      ]
    },
    {
      id: 'scheduled',
      title: 'Entretiens planifiés',
      count: 2,
      value: '200,00€',
      color: 'yellow',
      cards: [
        {
          title: 'Lyon Part-Dieu, France',
          person: 'Finnley Todd',
          status: 'Rapport complet',
          statusColor: 'green',
          tags: ['Brouillon de proposition'],
          time: '6 jours',
          updated: 'Mise à jour il y a 7 jours',
        },
        {
          title: 'Tothill Street, London, UK',
          person: 'Joy Horton',
          status: null,
          tags: ['Tâches 0/2'],
          time: '7 jours',
          updated: 'Mise à jour il y a 8 jours',
        },
      ]
    },
    {
      id: 'sent',
      title: 'Propositions envoyées',
      count: 2,
      value: '250,00€',
      color: 'blue',
      cards: [
        {
          title: 'Marseille 8e, France',
          person: 'Eve Neal',
          status: 'Rapport annulé',
          statusColor: 'red',
          tags: [],
          time: '5 jours',
          updated: 'Mise à jour il y a 6 jours',
        },
        {
          title: 'Nice Promenade, France',
          person: 'Paul Diaz',
          status: 'Rapport complet',
          statusColor: 'green',
          tags: [],
          time: '5 jours',
          updated: 'Mise à jour il y a 6 jours',
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              Vue Kanban
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              Vue Liste
            </button>
            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              Paramètres
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              Tous les travaux
              <ChevronRight className="w-4 h-4 rotate-90" />
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Filtres & tris
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
              <span className="text-lg">+</span>
              Ajouter nouveau
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {kanbanColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              count={column.count}
              value={column.value}
              color={column.color}
              cards={column.cards}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  count: number;
  value: string;
  color: 'orange' | 'yellow' | 'blue';
  cards: Array<{
    title: string;
    person: string;
    status: string | null;
    statusColor?: 'green' | 'red';
    tags: string[];
    time: string;
    updated: string;
  }>;
}

function KanbanColumn({ title, count, value, color, cards }: KanbanColumnProps) {
  const colorClasses = {
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className="bg-slate-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colorClasses[color]}`} />
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <span className="text-sm text-slate-500">{count}</span>
        </div>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>

      <div className="space-y-3">
        {cards.map((card, index) => (
          <KanbanCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}

interface KanbanCardProps {
  title: string;
  person: string;
  status: string | null;
  statusColor?: 'green' | 'red';
  tags: string[];
  time: string;
  updated: string;
}

function KanbanCard({ title, person, status, statusColor, tags, time, updated }: KanbanCardProps) {
  const statusColors = {
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="mb-3">
        {tags.map((tag, idx) => (
          <span key={idx} className="inline-flex items-center gap-1 text-xs text-slate-600 mb-2">
            <FileText className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      <h4 className="font-semibold text-slate-900 mb-3">{title}</h4>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-slate-600">{person.charAt(0)}</span>
        </div>
        <span className="text-sm text-slate-700">{person}</span>
      </div>

      {status && (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium mb-3 ${statusColor ? statusColors[statusColor] : 'bg-slate-50 text-slate-700'}`}>
          <FileText className="w-3 h-3" />
          {status}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
        <span>{time}</span>
        <span>{updated}</span>
      </div>
    </div>
  );
}
