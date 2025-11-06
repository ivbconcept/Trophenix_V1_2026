import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Trophy, Plus, Search, Filter } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'competition' | 'training' | 'meeting';
  startDate: Date;
  endDate: Date;
  location: string;
  color: string;
  sport?: string;
  description?: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Marathon de Paris 2028',
    type: 'competition',
    startDate: new Date('2025-11-15T08:00:00'),
    endDate: new Date('2025-11-15T12:00:00'),
    location: 'Paris, France',
    color: 'bg-red-500',
    sport: 'Athlétisme',
    description: 'Marathon Elite - 42.195 km',
  },
  {
    id: '2',
    title: 'Entraînement Piste',
    type: 'training',
    startDate: new Date('2025-11-12T09:00:00'),
    endDate: new Date('2025-11-12T11:00:00'),
    location: 'Stade Jean Bouin',
    color: 'bg-blue-500',
    description: 'Séance de vitesse',
  },
  {
    id: '3',
    title: 'Championnat Open de Tennis',
    type: 'competition',
    startDate: new Date('2025-11-08T14:00:00'),
    endDate: new Date('2025-11-10T18:00:00'),
    location: 'Nice, France',
    color: 'bg-red-500',
    sport: 'Tennis',
    description: 'Quart de finale',
  },
  {
    id: '4',
    title: 'Réunion Sponsor',
    type: 'meeting',
    startDate: new Date('2025-11-13T15:00:00'),
    endDate: new Date('2025-11-13T16:30:00'),
    location: 'Visioconférence',
    color: 'bg-purple-500',
    description: 'Discussion partenariat Nike',
  },
  {
    id: '5',
    title: 'Coupe de France Cyclisme',
    type: 'competition',
    startDate: new Date('2025-11-20T09:00:00'),
    endDate: new Date('2025-11-20T17:00:00'),
    location: 'Bordeaux, France',
    color: 'bg-red-500',
    sport: 'Cyclisme',
    description: '1ère étape - 120km',
  },
  {
    id: '6',
    title: 'Entraînement Cardio',
    type: 'training',
    startDate: new Date('2025-11-14T07:00:00'),
    endDate: new Date('2025-11-14T08:30:00'),
    location: 'Bois de Boulogne',
    color: 'bg-blue-500',
    description: 'Course longue - 15km',
  },
];

export function CompetitionAgenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<'week' | 'month'>('week');

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const getHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const isEventOnDay = (event: CalendarEvent, day: Date) => {
    const eventStart = new Date(event.startDate);
    return (
      eventStart.getDate() === day.getDate() &&
      eventStart.getMonth() === day.getMonth() &&
      eventStart.getFullYear() === day.getFullYear()
    );
  };

  const getEventPosition = (event: CalendarEvent) => {
    const startHour = event.startDate.getHours();
    const startMinute = event.startDate.getMinutes();
    const endHour = event.endDate.getHours();
    const endMinute = event.endDate.getMinutes();

    const top = (startHour * 60 + startMinute) / 60;
    const duration = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;

    return { top: `${top * 4}rem`, height: `${duration * 4}rem` };
  };

  const weekDays = getWeekDays();
  const hours = getHours();

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Agenda</h1>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Aujourd'hui
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousWeek}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium text-gray-900 min-w-[200px] text-center">
                {formatMonthYear()}
              </span>
              <button
                onClick={goToNextWeek}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Créer
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-8 border-t border-gray-200">
          <div className="col-span-1 py-2 px-4 text-xs font-medium text-gray-500">
            GMT+01
          </div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`py-2 px-4 text-center ${
                isToday(day) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
              </div>
              <div
                className={`text-2xl font-semibold ${
                  isToday(day)
                    ? 'bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto'
                    : 'text-gray-900'
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 relative">
          <div className="col-span-1 border-r border-gray-200">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b border-gray-200 px-2 py-1">
                <span className="text-xs text-gray-500">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {weekDays.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`relative border-r border-gray-200 ${
                isToday(day) ? 'bg-blue-50/30' : ''
              }`}
            >
              {hours.map((hour) => (
                <div
                  key={`${dayIndex}-${hour}`}
                  className="h-16 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                />
              ))}

              <div className="absolute inset-0 pointer-events-none">
                {mockEvents
                  .filter((event) => isEventOnDay(event, day))
                  .map((event) => {
                    const position = getEventPosition(event);
                    return (
                      <div
                        key={event.id}
                        className={`absolute left-1 right-1 ${event.color} text-white rounded-lg p-2 shadow-md cursor-pointer hover:shadow-lg transition-all pointer-events-auto overflow-hidden`}
                        style={{
                          top: position.top,
                          height: position.height,
                          minHeight: '3rem',
                        }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="text-xs font-semibold line-clamp-1">
                          {event.title}
                        </div>
                        <div className="text-xs opacity-90 line-clamp-1 mt-0.5">
                          {event.startDate.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        {event.location && (
                          <div className="text-xs opacity-80 line-clamp-1 mt-0.5">
                            {event.location}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`${selectedEvent.color} p-6 text-white`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedEvent.sport && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-white/20 rounded">
                  {selectedEvent.sport}
                </span>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEvent.startDate.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedEvent.startDate.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' - '}
                    {selectedEvent.endDate.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">{selectedEvent.location}</p>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900">{selectedEvent.description}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${selectedEvent.color}`}
                />
                <span className="text-sm text-gray-600">
                  {selectedEvent.type === 'competition'
                    ? 'Compétition'
                    : selectedEvent.type === 'training'
                    ? 'Entraînement'
                    : 'Réunion'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 flex gap-2">
              <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Modifier
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Détails
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
