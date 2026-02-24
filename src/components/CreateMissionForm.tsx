import React, { useEffect, useState } from 'react';
import { Button, Input, Card } from './ui';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

export const CreateMissionForm = ({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    establishment_id: '',
    date: '',
    start_time: '',
    end_time: '',
    price: '',
  });

  useEffect(() => {
    const fetchEstablishments = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('establishments')
        .select('id, name')
        .eq('owner_id', user.id);
      
      if (data) {
        setEstablishments(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, establishment_id: data[0].id }));
        }
      }
    };
    fetchEstablishments();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.establishment_id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('missions')
        .insert({
          title: formData.title,
          establishment_id: formData.establishment_id,
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          price: parseFloat(formData.price),
          status: 'open',
          employee_id: null // Initially no employee assigned
        });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating mission:', error);
      alert('Erreur lors de la création de la mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-6 space-y-4 bg-night-black border-night-purple">
      <h2 className="text-xl font-bold">Publier une nouvelle mission</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Titre du poste</label>
          <Input 
            required
            placeholder="Ex: Barman, DJ..."
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Établissement</label>
          {establishments.length > 0 ? (
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-night-purple"
              value={formData.establishment_id}
              onChange={e => setFormData({...formData, establishment_id: e.target.value})}
              required
            >
              {establishments.map(est => (
                <option key={est.id} value={est.id} className="bg-night-black">{est.name}</option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-red-400 p-2 border border-red-500/20 bg-red-500/10 rounded">
              Vous devez d'abord créer un établissement dans votre profil.
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
            <Input 
              type="date"
              required
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Rémunération (€)</label>
            <Input 
              type="number"
              required
              placeholder="100"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Début</label>
            <Input 
              type="time"
              required
              value={formData.start_time}
              onChange={e => setFormData({...formData, start_time: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Fin</label>
            <Input 
              type="time"
              required
              value={formData.end_time}
              onChange={e => setFormData({...formData, end_time: e.target.value})}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="flex-1" disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="employer" className="flex-1" disabled={loading || establishments.length === 0}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Publier'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
