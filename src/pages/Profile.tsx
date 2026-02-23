import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button, Card, cn } from '../components/ui';
import { User, Settings, LogOut } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-night-purple to-night-gold p-1">
          <div className="h-full w-full rounded-full bg-night-black flex items-center justify-center overflow-hidden">
            {user.profile_photo ? (
              <img src={user.profile_photo} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-gray-500" />
            )}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
          <div className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2",
            user.role === 'employer' ? "bg-role-employer/20 text-role-employer" : "bg-role-employee/20 text-role-employee"
          )}>
            {user.role === 'employer' ? 'Employeur' : 'Employé'}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-night-purple" /> Informations Personnelles
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <label className="text-gray-500 block mb-1">Email</label>
              <div>{user.email}</div>
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Téléphone</label>
              <div>{user.phone || 'Non renseigné'}</div>
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Ville</label>
              <div>{user.city || 'Libreville'}</div>
            </div>
          </div>
        </Card>

        <Button variant="outline" className="w-full">
          <Settings className="w-4 h-4 mr-2" /> Paramètres
        </Button>

        <Button 
          variant="ghost" 
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={() => useAuthStore.getState().signOut()}
        >
          <LogOut className="w-4 h-4 mr-2" /> Se déconnecter
        </Button>
      </div>
    </div>
  );
};
