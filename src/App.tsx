import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Missions } from './pages/Missions';
import { Planning } from './pages/Planning';
import { Chat } from './pages/Chat';

export default function App() {
  const { setSession, setUser, fetchProfile } = useAuthStore();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Try to fetch profile, if fails (table missing), mock it based on metadata
        fetchProfile(session.user.id).then(() => {
          // If profile fetch failed (likely due to missing table in this demo env),
          // we manually set the user from session metadata if available, or default
          const userMetadata = session.user.user_metadata;
          // Only set if not already set by fetchProfile (which would set it to the DB data)
          // We can check if the store user is null, but fetchProfile is async.
          // For safety in this demo, we can just merge or re-set if needed.
          // But simpler: if fetchProfile succeeds, it sets the user.
          // If it fails (and we are here), we might want to ensure we have a fallback.
          // However, useAuthStore.fetchProfile handles the set.
          
          // Let's just ensure we have a fallback if the DB read failed silently or returned nothing
          // We can do this by checking the store state, but we are outside the hook here.
          // Instead, let's just rely on the auth state change listener which is more robust.
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        
        // Attempt to fetch real profile
        await fetchProfile(session.user.id);
        
        // If the store still doesn't have a user (meaning DB fetch failed or no record),
        // create a temporary user object from the session
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
           setUser({
            id: session.user.id,
            email: session.user.email!,
            role: userMetadata?.role || 'employee',
            first_name: userMetadata?.first_name || 'User',
            last_name: userMetadata?.last_name || '',
            verified: false,
            rating: 5.0,
            created_at: new Date().toISOString(),
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
