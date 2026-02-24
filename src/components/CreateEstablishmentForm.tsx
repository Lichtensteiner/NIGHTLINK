import React, { useState } from 'react';
import { Button, Input, Card } from './ui';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

export const CreateEstablishmentForm = ({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'bar',
    address: '',
    city: '',
    country: 'Gabon',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('establishments')
        .insert({
          name: formData.name,
          type: formData.type,
          address: formData.address,
          city: formData.city || user.city,
          country: formData.country,
          description: formData.description,
          owner_id: user.id
        });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating establishment:', error);
      alert("Erreur lors de la création de l'établissement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-6 space-y-4 bg-night-black border-night-purple">
      <h2 className="text-xl font-bold">Ajouter un établissement</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Nom</label>
          <Input 
            required
            placeholder="Ex: Le VIP Room"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
          <select 
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-night-purple"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
            required
          >
            <option value="bar" className="bg-night-black">Bar</option>
            <option value="club" className="bg-night-black">Club / Discothèque</option>
            <option value="lounge" className="bg-night-black">Lounge</option>
            <option value="restaurant" className="bg-night-black">Restaurant</option>
            <option value="snack-bar" className="bg-night-black">Snack-Bar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Adresse</label>
          <Input 
            required
            placeholder="Quartier Louis..."
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Ville</label>
            <Input 
              required
              value={formData.city}
              placeholder={user?.city || 'Libreville'}
              onChange={e => setFormData({...formData, city: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Pays</label>
            <Input 
              required
              value={formData.country}
              onChange={e => setFormData({...formData, country: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-night-purple min-h-[100px]"
            placeholder="Description de l'ambiance, musique..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="flex-1" disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="employer" className="flex-1" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
