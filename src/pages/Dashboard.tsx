import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button, Card, cn } from '../components/ui';
import { Briefcase, Clock, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Dashboard = () => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Bonjour, <Link to="/profile" className="hover:text-night-purple hover:underline transition-colors">{user.first_name || 'User'}</Link> 👋
          </h1>
          <p className="text-gray-400">
            {user.role === 'employee' ? 'Prêt pour votre prochaine mission ?' : 'Gérez vos établissements et recrutements.'}
          </p>
        </div>
        {user.role === 'employer' && (
          <Button variant="employer" size="sm">
            + Nouvelle Mission
          </Button>
        )}
      </div>

      {user.role === 'employee' ? <EmployeeDashboard userId={user.id} isDemo={user.isDemo} /> : <EmployerDashboard userId={user.id} isDemo={user.isDemo} />}
    </div>
  );
};

const EmployeeDashboard = ({ userId, isDemo }: { userId: string, isDemo?: boolean }) => {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ rating: 0, completed: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (isDemo) {
        // Mock data for demo
        setMissions([
          { id: 1, title: 'Barman Mixologue', price: 120, status: 'open', start_time: '22:00', end_time: '04:00', establishments: { name: 'Le VIP Room' } },
          { id: 2, title: 'Sécurité', price: 100, status: 'open', start_time: '23:00', end_time: '05:00', establishments: { name: 'Club 55' } },
        ]);
        setStats({ rating: 4.8, completed: 12 });
        setLoading(false);
        return;
      }

      try {
        // Fetch missions
        const { data: missionsData, error: missionsError } = await supabase
          .from('missions')
          .select(`
            *,
            establishments (name)
          `)
          .eq('status', 'open')
          .order('date', { ascending: true })
          .limit(5);

        if (missionsError) throw missionsError;

        // Fetch user stats
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('rating, total_reviews')
          .eq('id', userId)
          .maybeSingle();

        if (userError) throw userError;

        // Fetch completed missions count
        const { count, error: countError } = await supabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .eq('employee_id', userId)
          .eq('status', 'completed');

        if (countError) throw countError;

        setMissions(missionsData || []);
        setStats({
          rating: userData?.rating || 0,
          completed: count || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-night-gold" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-role-employee/10 border-role-employee/20">
          <div className="text-2xl font-bold text-role-employee">{stats.rating.toFixed(1)}</div>
          <div className="text-xs text-gray-400">Note Moyenne</div>
        </Card>
        <Card className="p-4 bg-night-gold/10 border-night-gold/20">
          <div className="text-2xl font-bold text-night-gold">{stats.completed}</div>
          <div className="text-xs text-gray-400">Missions Réalisées</div>
        </Card>
      </div>

      <h2 className="text-lg font-semibold">Missions Disponibles</h2>
      <div className="space-y-3">
        {missions.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune mission disponible pour le moment.</p>
        ) : (
          missions.map((mission) => (
            <Card key={mission.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
              <div className="space-y-1">
                <h3 className="font-semibold">{mission.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {mission.establishments?.name || 'Établissement'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mission.start_time?.slice(0, 5)} - {mission.end_time?.slice(0, 5)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-night-gold">{mission.price}€</div>
                <div className={cn(
                  "text-xs px-2 py-0.5 rounded-full inline-block mt-1",
                  mission.status === 'open' ? "bg-status-open/20 text-status-open" : "bg-status-assigned/20 text-status-assigned"
                )}>
                  {mission.status === 'open' ? 'Disponible' : 'Assigné'}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const EmployerDashboard = ({ userId, isDemo }: { userId: string, isDemo?: boolean }) => {
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ applications: 0, activeMissions: 0, ratedEmployees: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (isDemo) {
        // Mock data for demo
        setEstablishments([
          { id: 'demo-1', name: 'Night Club Demo', type: 'club', city: 'Libreville', country: 'Gabon' }
        ]);
        setStats({ applications: 5, activeMissions: 2, ratedEmployees: 8 });
        setLoading(false);
        return;
      }

      try {
        // Fetch establishments
        const { data: establishmentsData, error: establishmentsError } = await supabase
          .from('establishments')
          .select('*')
          .eq('owner_id', userId);

        if (establishmentsError) throw establishmentsError;

        // Fetch active missions count
        // Note: This requires a join or separate query if we want to filter by owner's establishments
        // For simplicity, we'll fetch missions where establishment is in the user's establishments list
        // But first we need the establishment IDs
        const establishmentIds = establishmentsData?.map(e => e.id) || [];
        
        let activeMissionsCount = 0;
        if (establishmentIds.length > 0) {
          const { count, error: countError } = await supabase
            .from('missions')
            .select('*', { count: 'exact', head: true })
            .in('establishment_id', establishmentIds)
            .eq('status', 'open'); // Assuming 'open' means active/recruiting
          
          if (!countError) activeMissionsCount = count || 0;
        }

        setEstablishments(establishmentsData || []);
        setStats({
          applications: 0, // Placeholder as we don't have applications table yet
          activeMissions: activeMissionsCount,
          ratedEmployees: 0 // Placeholder
        });
      } catch (error) {
        console.error('Error fetching employer dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-night-purple" /></div>;
  }

  const statCards = [
    { label: 'Candidatures', value: stats.applications, color: 'text-night-purple' },
    { label: 'Missions actives', value: stats.activeMissions, color: 'text-blue-400' },
    { label: 'Employés notés', value: stats.ratedEmployees, color: 'text-night-gold' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="p-4 flex flex-col items-center justify-center text-center">
            <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-semibold">Vos Établissements</h2>
      <div className="space-y-4">
        {establishments.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-white/10 rounded-xl">
            <p className="text-gray-400 mb-4">Vous n'avez pas encore ajouté d'établissement.</p>
            <Button variant="employer" size="sm">Ajouter un établissement</Button>
          </div>
        ) : (
          establishments.map((establishment) => (
            <Card key={establishment.id} className="p-0 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-purple-900 to-blue-900 relative">
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold">{establishment.name}</h3>
                  <p className="text-xs text-gray-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {establishment.city}, {establishment.country || 'Gabon'}
                  </p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  <span className="text-white font-medium">{establishment.type}</span>
                </div>
                <Button size="sm" variant="outline">Gérer</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
