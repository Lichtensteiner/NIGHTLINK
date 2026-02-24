import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Button, Input, Card, cn } from '../components/ui';
import { UserRole } from '../types';

export const AuthPage = () => {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [city, setCity] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('employee');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Get role from URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam === 'employer') setRole('employer');
    if (roleParam === 'employee') setRole('employee');
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              role: role,
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              city: city,
              company_name: role === 'employer' ? companyName : undefined
            }
          }
        });
        if (error) throw error;
        
        if (data.session) {
          navigate('/dashboard');
        } else if (data.user) {
          // User created but session is null => Email confirmation required
          setSuccessMessage("Compte créé ! Veuillez vérifier vos emails pour confirmer votre inscription avant de vous connecter.");
          setIsLogin(true); // Switch to login view
        }
      }
    } catch (err: any) {
      if (err.message === "Email not confirmed") {
        setError("Votre compte n'est pas encore activé. Veuillez cliquer sur le lien reçu par email.");
        // Optional: Add logic to show a "Resend Confirmation" button here if needed
      } else if (err.message === "Invalid login credentials") {
        setError("Email ou mot de passe incorrect.");
      } else if (err.message.includes("Email rate limit exceeded")) {
        setError("Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer ou utiliser une autre adresse email.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
      setSuccessMessage("Email de confirmation renvoyé ! Vérifiez vos spams.");
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-10">
      <Card className={cn(
        "w-full max-w-md p-8 space-y-6 border-t-4",
        role === 'employer' ? "border-t-role-employer" : "border-t-role-employee"
      )}>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">
            {isLogin 
              ? (role === 'employer' ? 'Espace Recruteur' : 'Espace Candidat')
              : (role === 'employer' ? 'Créer un compte Recruteur' : 'Créer un compte Candidat')
            }
          </h2>
          <p className="text-gray-400">
            {isLogin ? 'Bon retour parmi nous' : 'Rejoignez la communauté Nightlink'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex flex-col gap-2">
            <p>{error}</p>
            {error.includes("pas encore activé") && (
              <button 
                onClick={handleResendConfirmation}
                className="text-xs underline hover:text-red-400 self-start"
              >
                Renvoyer l'email de confirmation
              </button>
            )}
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 mb-4">
              ℹ️ Utilisez une <strong>vraie adresse email</strong> pour recevoir le lien d'activation requis pour la connexion.
            </div>
          )}
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setRole('employee')}
                  className={cn(
                    "p-2 rounded-lg border text-sm font-medium transition-all",
                    role === 'employee' 
                      ? "bg-role-employee text-white border-transparent" 
                      : "border-white/10 hover:bg-white/5"
                  )}
                >
                  Employé
                </button>
                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={cn(
                    "p-2 rounded-lg border text-sm font-medium transition-all",
                    role === 'employer' 
                      ? "bg-role-employer text-white border-transparent" 
                      : "border-white/10 hover:bg-white/5"
                  )}
                >
                  Employeur
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Prénom</label>
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                    placeholder="Jean"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nom</label>
                  <Input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    required 
                    placeholder="Dupont"
                  />
                </div>
              </div>

              {role === 'employer' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nom de l'établissement</label>
                  <Input 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    required 
                    placeholder="Le VIP Room"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Téléphone</label>
                <Input 
                  type="tel"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Ville</label>
                <Input 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  required 
                  placeholder="Paris"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="exemple@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Mot de passe</label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            variant={role === 'employer' ? 'employer' : 'employee'}
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
          </Button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </Card>
    </div>
  );
};
