import React from 'react';
import { Button, Input, Card } from './ui';

export const CreateMissionForm = ({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    establishment: '',
    date: '',
    startTime: '',
    endTime: '',
    price: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
          <Input 
            required
            placeholder="Nom de l'établissement"
            value={formData.establishment}
            onChange={e => setFormData({...formData, establishment: e.target.value})}
          />
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
              value={formData.startTime}
              onChange={e => setFormData({...formData, startTime: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Fin</label>
            <Input 
              type="time"
              required
              value={formData.endTime}
              onChange={e => setFormData({...formData, endTime: e.target.value})}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
          <Button type="submit" variant="employer" className="flex-1">
            Publier
          </Button>
        </div>
      </form>
    </Card>
  );
};
