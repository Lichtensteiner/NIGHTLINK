import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button, Card, cn } from '../components/ui';
import { User, Settings, LogOut, MapPin, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CreateEstablishmentForm } from '../components/CreateEstablishmentForm';

export const Profile = () => {
  const { user: currentUser } = useAuthStore();
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [loadingEst, setLoadingEst] = useState(false);
  const [showCreateEst, setShowCreateEst] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoadingProfile(true);
      
      // If no userId in URL, show current user
      if (!userId) {
        setProfileUser(currentUser);
        setLoadingProfile(false);
        return;
      }

      // If userId matches current user, show current user
      if (currentUser && userId === currentUser.id) {
        setProfileUser(currentUser);
        setLoadingProfile(false);
        return;
      }

      // Fetch other user's profile
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        setProfileUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, [userId, currentUser]);

  useEffect(() => {
    if (profileUser?.role === 'employer') {
      fetchEstablishments();
    }
  }, [profileUser]);

  const fetchEstablishments = async () => {
    if (!profileUser) return;
    setLoadingEst(true);

    if (profileUser.isDemo) {
      setEstablishments([
        { id: 'demo-1', name: 'Night Club Demo', type: 'club', city: 'Libreville', country: 'Gabon' }
      ]);
      setLoadingEst(false);
      return;
    }

    const { data } = await supabase
      .from('establishments')
      .select('*')
      .eq('owner_id', profileUser.id);
    setEstablishments(data || []);
    setLoadingEst(false);
  };

  if (!currentUser) return <Navigate to="/auth" />;
  if (loadingProfile) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-night-purple" /></div>;
  if (!profileUser) return <div className="text-center p-8 text-gray-400">Utilisateur introuvable</div>;

  const isOwnProfile = currentUser.id === profileUser.id;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-night-purple to-night-gold p-1">
          <div className="h-full w-full rounded-full bg-night-black flex items-center justify-center overflow-hidden">
            {profileUser.profile_photo ? (
              <img src={profileUser.profile_photo} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-gray-500" />
            )}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{profileUser.first_name} {profileUser.last_name}</h2>
          <div className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2",
            profileUser.role === 'employer' ? "bg-role-employer/20 text-role-employer" : "bg-role-employee/20 text-role-employee"
          )}>
            {profileUser.role === 'employer' ? 'Employeur' : 'Employé'}
          </div>
        </div>
      </div>

      {showCreateEst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-night-black border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CreateEstablishmentForm 
              onCancel={() => setShowCreateEst(false)} 
              onSuccess={() => {
                setShowCreateEst(false);
                fetchEstablishments();
              }} 
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Card className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-night-purple" /> Informations Personnelles
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <label className="text-gray-500 block mb-1">Email</label>
              <div>{profileUser.email}</div>
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Téléphone</label>
              <div>{profileUser.phone || 'Non renseigné'}</div>
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Ville</label>
              <div>{profileUser.city || 'Libreville'}</div>
            </div>
          </div>
        </Card>

        {profileUser.role === 'employer' && (
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-night-gold" /> Établissements
              </h3>
              {isOwnProfile && (
                <Button size="sm" variant="ghost" onClick={() => setShowCreateEst(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {loadingEst ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin w-4 h-4 text-gray-500" /></div>
            ) : establishments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-2">Aucun établissement ajouté.</p>
            ) : (
              <div className="space-y-3">
                {establishments.map(est => (
                  <div key={est.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{est.name}</div>
                      <div className="text-xs text-gray-400">{est.type} • {est.city}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {isOwnProfile && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
