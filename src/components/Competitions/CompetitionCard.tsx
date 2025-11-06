import React from 'react';
import { Calendar, MapPin, Euro, Users, Award, TrendingUp } from 'lucide-react';

interface Competition {
  id: string;
  title: string;
  sport: string;
  start_date: string;
  end_date: string;
  location_city: string;
  location_venue: string;
  registration_fee: number;
  total_spots: number;
  remaining_spots: number;
  registration_deadline: string;
  level: string[];
  featured?: boolean;
  cover_image_url?: string;
  organizer?: {
    organization_name: string;
    verification_status: string;
  };
}

interface CompetitionCardProps {
  competition: Competition;
  onClick?: () => void;
  showOrganizer?: boolean;
}

export function CompetitionCard({ competition, onClick, showOrganizer = true }: CompetitionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getLevelBadgeColor = (levels: string[]) => {
    if (levels.includes('international')) return 'bg-purple-100 text-purple-800';
    if (levels.includes('national')) return 'bg-blue-100 text-blue-800';
    if (levels.includes('regional')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const spotsRemaining = competition.remaining_spots;
  const spotsPercentage = (spotsRemaining / competition.total_spots) * 100;
  const isAlmostFull = spotsPercentage < 20 && spotsPercentage > 0;
  const isFull = spotsRemaining === 0;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
        onClick ? 'cursor-pointer transform hover:-translate-y-1' : ''
      } border border-gray-100`}
    >
      {competition.cover_image_url && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={competition.cover_image_url}
            alt={competition.title}
            className="w-full h-full object-cover"
          />
          {competition.featured && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
              <Award className="w-4 h-4" />
              Mise en avant
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {competition.title}
            </h3>
            {showOrganizer && competition.organizer && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                Par {competition.organizer.organization_name}
                {competition.organizer.verification_status === 'verified' && (
                  <span className="text-blue-500" title="Organisateur vérifié">✓</span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm">
              {formatDate(competition.start_date)}
              {competition.start_date !== competition.end_date && ` - ${formatDate(competition.end_date)}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-sm">
              {competition.location_city} • {competition.location_venue}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Euro className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm font-semibold">
              {competition.registration_fee === 0
                ? 'Gratuit'
                : `${competition.registration_fee.toFixed(2)}€`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <span className="text-sm">
              <span className={isFull ? 'text-red-600 font-semibold' : isAlmostFull ? 'text-orange-600 font-semibold' : ''}>
                {spotsRemaining} places restantes
              </span>
              <span className="text-gray-500"> sur {competition.total_spots}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {competition.sport}
          </span>
          {competition.level.map((level) => (
            <span
              key={level}
              className={`text-xs font-semibold px-3 py-1 rounded-full ${getLevelBadgeColor(competition.level)}`}
            >
              {level === 'open' ? 'Ouvert à tous' : level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
          ))}
        </div>

        {isAlmostFull && !isFull && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <span className="text-xs text-orange-800 font-medium">
              Places limitées ! Inscrivez-vous rapidement
            </span>
          </div>
        )}

        {isFull && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-xs text-red-800 font-medium">
              Complet - Inscriptions closes
            </span>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          Date limite d'inscription : {formatDate(competition.registration_deadline)}
        </div>
      </div>
    </div>
  );
}
