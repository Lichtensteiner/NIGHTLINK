import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Card, cn } from '../components/ui';
import { Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

export const Planning = () => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/auth" />;

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(today, { weekStartsOn: 1 }), i));

  // Mock data - different for roles
  const employeeMissions = [
    { id: 1, title: 'Barman Mixologue', establishment: 'Le VIP Room', date: today, time: '22:00 - 04:00', status: 'confirmed' },
    { id: 3, title: 'Serveur Carré VIP', establishment: 'Lounge Sky', date: addDays(today, 2), time: '21:00 - 03:00', status: 'pending' },
  ];

  const employerMissions = [
    { id: 1, title: 'Barman Mixologue', employee: 'Jean D.', date: today, time: '22:00 - 04:00', status: 'confirmed' },
    { id: 2, title: 'Sécurité', employee: 'Marc A.', date: today, time: '22:00 - 05:00', status: 'confirmed' },
    { id: 3, title: 'DJ Set', employee: 'Sarah K.', date: addDays(today, 1), time: '23:00 - 04:00', status: 'pending' },
  ];

  const missions = user.role === 'employer' ? employerMissions : employeeMissions;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {user.role === 'employer' ? 'Planning des équipes' : 'Mon Planning'}
      </h1>

      {/* Week View */}
      <Card className="p-4 overflow-x-auto">
        <div className="flex justify-between min-w-[300px]">
          {weekDays.map((day, i) => {
            const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
            const hasEvent = missions.some(m => format(m.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
            
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 capitalize">{format(day, 'EEE', { locale: fr })}</span>
                <div className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isToday ? "bg-night-purple text-white" : "text-white",
                  hasEvent && !isToday ? "bg-white/10" : ""
                )}>
                  {format(day, 'd')}
                </div>
                {/* Dot for event */}
                {hasEvent && (
                  <div className="h-1.5 w-1.5 rounded-full bg-night-gold" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <h2 className="text-lg font-semibold mt-6">
        {user.role === 'employer' ? 'Missions Planifiées' : 'Prochaines Missions'}
      </h2>
      
      <div className="space-y-4">
        {missions.map((mission) => (
          <div key={mission.id} className="flex gap-4">
            <div className="flex flex-col items-center min-w-[50px]">
              <span className="text-sm font-bold text-night-purple">{format(mission.date, 'd MMM', { locale: fr })}</span>
              <div className="h-full w-0.5 bg-white/10 mt-2" />
            </div>
            <Card className="flex-1 p-4 mb-4 hover:bg-white/5 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{mission.title}</h3>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full uppercase",
                  mission.status === 'confirmed' ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                )}>
                  {mission.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-400">
                {user.role === 'employer' ? (
                   <div className="flex items-center gap-2">
                     <User className="w-3 h-3" /> {mission.employee}
                   </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {mission.establishment}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {mission.time}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
