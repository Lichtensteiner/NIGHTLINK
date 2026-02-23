import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Card, Button, Input, cn } from '../components/ui';
import { Briefcase, MapPin, Clock, Search, Filter, Plus } from 'lucide-react';
import { CreateMissionForm } from '../components/CreateMissionForm';

export const Missions = () => {
  const { user } = useAuthStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Mock state for missions to demonstrate adding new ones
  const [missions, setMissions] = useState([
    { id: 1, title: 'Barman Mixologue', establishment: 'Le VIP Room', location: 'Libreville', date: 'Ce soir', time: '22:00 - 04:00', price: 120, status: 'open', tags: ['Cocktails', 'Expérience requise'] },
    { id: 2, title: 'Sécurité Entrée', establishment: 'Club 55', location: 'Libreville', date: 'Demain', time: '23:00 - 05:00', price: 100, status: 'open', tags: ['Permis sécurité'] },
    { id: 3, title: 'Serveur Carré VIP', establishment: 'Lounge Sky', location: 'Libreville', date: 'Ven. 24 Fév', time: '21:00 - 03:00', price: 150, status: 'assigned', tags: ['Service bouteille'] },
    { id: 4, title: 'DJ Set Warmup', establishment: 'Beach Club', location: 'Port-Gentil', date: 'Sam. 25 Fév', time: '18:00 - 22:00', price: 200, status: 'open', tags: ['House', 'Afrobeat'] },
    { id: 5, title: 'Hôtesse d\'accueil', establishment: 'Restaurant Le Phare', location: 'Libreville', date: 'Dim. 26 Fév', time: '19:00 - 23:00', price: 80, status: 'open', tags: ['Anglais courant'] },
  ]);

  if (!user) return <Navigate to="/auth" />;

  const handleCreateMission = (data: any) => {
    const newMission = {
      id: missions.length + 1,
      title: data.title,
      establishment: data.establishment,
      location: user.city || 'Libreville',
      date: new Date(data.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
      time: `${data.startTime} - ${data.endTime}`,
      price: parseInt(data.price),
      status: 'open',
      tags: ['Nouveau']
    };
    // @ts-ignore
    setMissions([newMission, ...missions]);
    setShowCreateForm(false);
  };

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
          <CreateMissionForm onCancel={() => setShowCreateForm(false)} onSubmit={handleCreateMission} />
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input placeholder="Rechercher une mission..." className="pl-10" />
      </div>

      <div className="space-y-4">
        {missions.map((mission) => (
          <Card key={mission.id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-night-purple">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{mission.title}</h3>
                <div className="text-night-purple font-medium text-sm">{mission.establishment}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl text-night-gold">{mission.price}€</div>
                <div className="text-xs text-gray-400">/ mission</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 my-3 text-sm text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {mission.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mission.date}, {mission.time}</span>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                {mission.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-gray-300">
                    {tag}
                  </span>
                ))}
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
        ))}
      </div>
    </div>
  );
};
