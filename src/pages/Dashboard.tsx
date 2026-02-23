import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button, Card, cn } from '../components/ui';
import { Briefcase, Clock, MapPin } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bonjour, {user.first_name || 'User'} 👋</h1>
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

      {user.role === 'employee' ? <EmployeeDashboard /> : <EmployerDashboard />}
    </div>
  );
};

const EmployeeDashboard = () => {
  // Mock data for display
  const missions = [
    { id: 1, title: 'Barman Mixologue', establishment: 'Le VIP Room', date: 'Ce soir', time: '22:00 - 04:00', price: 120, status: 'open' },
    { id: 2, title: 'Sécurité Entrée', establishment: 'Club 55', date: 'Demain', time: '23:00 - 05:00', price: 100, status: 'open' },
    { id: 3, title: 'Serveur Carré VIP', establishment: 'Lounge Sky', date: 'Ven. 24 Fév', time: '21:00 - 03:00', price: 150, status: 'assigned' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-role-employee/10 border-role-employee/20">
          <div className="text-2xl font-bold text-role-employee">4.8</div>
          <div className="text-xs text-gray-400">Note Moyenne</div>
        </Card>
        <Card className="p-4 bg-night-gold/10 border-night-gold/20">
          <div className="text-2xl font-bold text-night-gold">12</div>
          <div className="text-xs text-gray-400">Missions Réalisées</div>
        </Card>
      </div>

      <h2 className="text-lg font-semibold">Missions Disponibles</h2>
      <div className="space-y-3">
        {missions.map((mission) => (
          <Card key={mission.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
            <div className="space-y-1">
              <h3 className="font-semibold">{mission.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {mission.establishment}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mission.time}</span>
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
        ))}
      </div>
    </div>
  );
};

const EmployerDashboard = () => {
  const stats = [
    { label: 'Candidatures', value: 12, color: 'text-night-purple' },
    { label: 'Missions actives', value: 3, color: 'text-blue-400' },
    { label: 'Employés notés', value: 85, color: 'text-night-gold' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-4 flex flex-col items-center justify-center text-center">
            <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-semibold">Vos Établissements</h2>
      <Card className="p-0 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-purple-900 to-blue-900 relative">
          <div className="absolute bottom-4 left-4">
            <h3 className="text-xl font-bold">Le VIP Room</h3>
            <p className="text-xs text-gray-300 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Libreville, Gabon
            </p>
          </div>
        </div>
        <div className="p-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <span className="text-white font-medium">3</span> missions actives ce soir
          </div>
          <Button size="sm" variant="outline">Gérer</Button>
        </div>
      </Card>
    </div>
  );
};
