import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Card, cn } from '../components/ui';
import { Calendar as CalendarIcon, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../lib/supabase';

export const Planning = () => {
  const { user } = useAuthStore();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      if (!user) return;
      setLoading(true);

      if (user.isDemo) {
        // Mock data for demo
        setMissions([
          { id: 1, title: 'Barman Mixologue', date: new Date().toISOString(), start_time: '22:00', end_time: '04:00', status: 'assigned', establishments: { name: 'Le VIP Room' }, users: { first_name: 'Jean', last_name: 'D.' } },
          { id: 2, title: 'Sécurité', date: new Date(Date.now() + 86400000).toISOString(), start_time: '23:00', end_time: '05:00', status: 'open', establishments: { name: 'Club 55' }, users: null },
        ]);
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('missions')
          .select(`
            *,
            establishments (name),
            users:employee_id (first_name, last_name)
          `)
          .neq('status', 'cancelled') // Show all except cancelled
          .order('date', { ascending: true });

        if (user.role === 'employer') {
          // Get establishments owned by user
          const { data: establishments } = await supabase
            .from('establishments')
            .select('id')
            .eq('owner_id', user.id);
          
          const establishmentIds = establishments?.map(e => e.id) || [];
          
          if (establishmentIds.length > 0) {
            query = query.in('establishment_id', establishmentIds);
          } else {
            setMissions([]);
            setLoading(false);
            return;
          }
        } else {
          // Employee: show assigned missions
          query = query.eq('employee_id', user.id);
        }

        const { data, error } = await query;
        if (error) throw error;
        setMissions(data || []);
      } catch (error) {
        console.error('Error fetching planning:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [user]);

  if (!user) return <Navigate to="/auth" />;

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(today, { weekStartsOn: 1 }), i));

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-night-purple" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {user.role === 'employer' ? 'Planning des équipes' : 'Mon Planning'}
      </h1>

      {/* Week View */}
      <Card className="p-4 overflow-x-auto">
        <div className="flex justify-between min-w-[300px]">
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, today);
            const hasEvent = missions.some(m => isSameDay(new Date(m.date), day));
            
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
        {missions.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Aucune mission planifiée.</p>
        ) : (
          missions.map((mission) => (
            <div key={mission.id} className="flex gap-4">
              <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-sm font-bold text-night-purple">{format(new Date(mission.date), 'd MMM', { locale: fr })}</span>
                <div className="h-full w-0.5 bg-white/10 mt-2" />
              </div>
              <Card className="flex-1 p-4 mb-4 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{mission.title}</h3>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full uppercase",
                    mission.status === 'assigned' ? "bg-green-500/20 text-green-500" : 
                    mission.status === 'open' ? "bg-blue-500/20 text-blue-500" : "bg-yellow-500/20 text-yellow-500"
                  )}>
                    {mission.status === 'assigned' ? 'Confirmé' : 
                     mission.status === 'open' ? 'Ouvert' : mission.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-400">
                  {user.role === 'employer' ? (
                     <div className="flex items-center gap-2">
                       <User className="w-3 h-3" /> 
                       {mission.users ? (
                         <Link to={`/profile/${mission.employee_id}`} className="hover:text-night-purple hover:underline transition-colors">
                           {mission.users.first_name} {mission.users.last_name}
                         </Link>
                       ) : (
                         'Non assigné'
                       )}
                     </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> {mission.establishments?.name || 'Établissement'}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {mission.start_time?.slice(0, 5)} - {mission.end_time?.slice(0, 5)}
                  </div>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
