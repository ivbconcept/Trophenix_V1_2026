import { Eye, Heart, MessageCircle, Users } from 'lucide-react';

interface ProfileStatsProps {
  views?: number;
  likes?: number;
  messages?: number;
  connections?: number;
}

export function ProfileStats({ views = 0, likes = 0, messages = 0, connections = 0 }: ProfileStatsProps) {
  const stats = [
    {
      icon: Eye,
      label: 'Vues du profil',
      value: views,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Heart,
      label: 'Likes',
      value: likes,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      iconColor: 'text-pink-600 dark:text-pink-400'
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      value: messages,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Users,
      label: 'Connexions',
      value: connections,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
