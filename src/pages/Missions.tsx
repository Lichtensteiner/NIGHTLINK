import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Card, Button, Input, cn } from '../components/ui';
import { Briefcase, MapPin, Clock, Search, Filter, Plus, Loader2 } from 'lucide-react';
import { CreateMissionForm } from '../components/CreateMissionForm';
import { supabase } from '../lib/supabase';

export const Missions = () => {
  const { user } = useAuthStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('missions')
        .select(`
          *,
          establishments (name, city)
        `)
        .order('date', { ascending: true });

      if (user?.role === 'employer') {
        // Employers see missions from their establishments
        // First get establishments owned by user
        const { data: establishments } = await supabase
          .from('establishments')
          .select('id')
          .eq('owner_id', user.id);
        
        const establishmentIds = establishments?.map(e => e.id) || [];
        
        if (establishmentIds.length > 0) {
          query = query.in('establishment_id', establishmentIds);
        } else {
          // No establishments, no missions
          setMissions([]);
          setLoading(false);
          return;
        }
      } else {
        // Employees see all open missions
        query = query.eq('status', 'open');
      }

      const { data, error } = await query;

      if (error) throw error;
      setMissions(data || []);
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);

  if (!user) return <Navigate to="/auth" />;

  const handleMissionCreated = () => {
    setShowCreateForm(false);
    fetchMissions();
  };

  const filteredMissions = missions.filter(mission => 
    mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.establishments?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {user.role === 'employer' ? 'Mes Missions' : 'Missions Disponibles'}
        </h1>
        
        {user.role === 'employer' ? (
          <Button variant="employer" size="sm" onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Créer
          </Button>
        ) : (
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filtrer</Button>
        )}
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-night-black border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
             <CreateMissionForm onCancel={() => setShowCreateForm(false)} onSuccess={handleMissionCreated} />
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Rechercher une mission..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-night-purple" /></div>
      ) : (
        <div className="space-y-4">
          {filteredMissions.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Aucune mission trouvée.</p>
          ) : (
            filteredMissions.map((mission) => (
              <Card key={mission.id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-night-purple">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{mission.title}</h3>
                    <div className="text-night-purple font-medium text-sm">{mission.establishments?.name || 'Établissement inconnu'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-night-gold">{mission.price}€</div>
                    <div className="text-xs text-gray-400">/ mission</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 my-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {mission.establishments?.city || 'Libreville'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(mission.date).toLocaleDateString()}, {mission.start_time?.slice(0, 5)} - {mission.end_time?.slice(0, 5)}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    {/* Tags are not yet in DB, using static placeholder or could be added to schema */}
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-gray-300">
                      Mission
                    </span>
                  </div>
                  
                  {user.role === 'employee' ? (
                    <Button size="sm" variant={mission.status === 'open' ? 'employee' : 'secondary'} disabled={mission.status !== 'open'}>
                      {mission.status === 'open' ? 'Postuler' : 'Complet'}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Modifier</Button>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">Fermer</Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
