import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Card, Button, Input, cn } from '../components/ui';
import { Send, User, MoreVertical, Phone, Video } from 'lucide-react';

export const Chat = () => {
  const { user } = useAuthStore();
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  if (!user) return <Navigate to="/auth" />;

  // Mock Contacts
  const contacts = [
    { id: 1, name: 'Le VIP Room', role: 'employer', lastMessage: 'Confirmé pour ce soir ?', time: '14:30', online: true, avatar: null },
    { id: 2, name: 'Club 55', role: 'employer', lastMessage: 'Merci pour votre candidature', time: 'Hier', online: false, avatar: null },
    { id: 3, name: 'Marc (Sécurité)', role: 'employee', lastMessage: 'On se voit au briefing', time: 'Lun', online: true, avatar: null },
  ];

  // Mock Messages
  const [messages, setMessages] = useState([
    { id: 1, senderId: 1, text: 'Bonjour, êtes-vous disponible ce soir ?', time: '14:00', isMe: false },
    { id: 2, senderId: 999, text: 'Bonjour, oui je suis disponible !', time: '14:05', isMe: true },
    { id: 3, senderId: 1, text: 'Super, on commence à 22h.', time: '14:15', isMe: false },
    { id: 4, senderId: 999, text: 'Parfait, à tout à l\'heure.', time: '14:20', isMe: true },
    { id: 5, senderId: 1, text: 'Confirmé pour ce soir ?', time: '14:30', isMe: false },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        senderId: 999, // Me
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }
    ]);
    setMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-4">
      {/* Contacts List */}
      <Card className={cn(
        "w-full md:w-1/3 flex flex-col p-0 overflow-hidden",
        selectedContact !== null ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h2 className="font-bold text-lg">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={cn(
                "p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5",
                selectedContact === contact.id ? "bg-white/10" : ""
              )}
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-night-black" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{contact.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chat Window */}
      <Card className={cn(
        "w-full md:w-2/3 flex flex-col p-0 overflow-hidden bg-night-black/50",
        selectedContact === null ? "hidden md:flex" : "flex"
      )}>
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden -ml-2"
                  onClick={() => setSelectedContact(null)}
                >
                  ←
                </Button>
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold">{contacts.find(c => c.id === selectedContact)?.name}</h3>
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> En ligne
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex",
                    msg.isMe ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[75%] p-3 rounded-2xl text-sm",
                    msg.isMe 
                      ? "bg-night-purple text-white rounded-tr-none" 
                      : "bg-white/10 text-gray-200 rounded-tl-none"
                  )}>
                    <p>{msg.text}</p>
                    <span className={cn(
                      "text-[10px] block text-right mt-1 opacity-70",
                      msg.isMe ? "text-white" : "text-gray-400"
                    )}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  placeholder="Écrivez votre message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-night-black/50 border-white/10"
                />
                <Button type="submit" variant="primary" size="sm" className="px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Send className="h-8 w-8 opacity-50" />
            </div>
            <p>Sélectionnez une conversation pour commencer</p>
          </div>
        )}
      </Card>
    </div>
  );
};
