import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { Music, Coffee, Shield, Star, MapPin, Phone, Mail, Code, Globe, CheckCircle, Facebook, Instagram, Youtube, Linkedin, Send, MessageCircle, Video, User, Clock, PlusCircle, Briefcase, Calendar, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgroundImages = [
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920&auto=format&fit=crop", // Club crowd
    "https://images.unsplash.com/photo-1574391884720-2e4552002624?q=80&w=1920&auto=format&fit=crop", // DJ
    "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1920&auto=format&fit=crop", // Bar
    "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=1920&auto=format&fit=crop", // Concert
    "https://images.unsplash.com/photo-1576430511980-b96330cb354d?q=80&w=1920&auto=format&fit=crop", // Drinks
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop", // Event
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920&auto=format&fit=crop", // Party
    "https://images.unsplash.com/photo-1578736641330-3155e606cd40?q=80&w=1920&auto=format&fit=crop", // Night lights
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Music, title: 'DJs & Artistes', desc: 'Trouvez les meilleurs talents pour animer vos soirées.' },
    { icon: Coffee, title: 'Bar & Service', desc: 'Des barmans et serveurs qualifiés pour un service impeccable.' },
    { icon: Shield, title: 'Sécurité', desc: 'Assurez la sécurité de votre établissement avec des pros.' },
    { icon: Star, title: 'Hôtesses', desc: 'Un accueil chaleureux pour vos clients VIP.' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Video, href: '#', label: 'TikTok', color: 'hover:text-pink-400' }, // Lucide doesn't have TikTok, using Video as placeholder
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
    { icon: Send, href: '#', label: 'Telegram', color: 'hover:text-blue-400' },
    { icon: MessageCircle, href: '#', label: 'WhatsApp', color: 'hover:text-green-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-night-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center space-y-8 px-4 overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-night-black/80 via-night-black/50 to-night-black z-10" />
        </div>
        
        <div className="relative z-20 space-y-8 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-night-purple via-white to-night-gold bg-clip-text text-transparent drop-shadow-2xl">
                NIGHTLINK
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              La plateforme de référence pour le recrutement et la gestion de la vie nocturne au Gabon.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-lg mx-auto pt-8"
          >
            <Button 
              variant="employee" 
              size="lg" 
              className="w-full text-lg h-16 rounded-2xl shadow-lg shadow-night-purple/20 border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform"
              onClick={() => navigate('/auth?role=employee')}
            >
              Je cherche un job
            </Button>
            <Button 
              variant="employer" 
              size="lg" 
              className="w-full text-lg h-16 rounded-2xl shadow-lg shadow-night-gold/20 border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform"
              onClick={() => navigate('/auth?role=employer')}
            >
              Je recrute
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-night-black relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tout pour la <span className="text-night-purple">Nightlife</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Une suite complète d'outils pour connecter les talents et les établissements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-night-purple/50 transition-all duration-300 group"
              >
                <div className="h-14 w-14 rounded-2xl bg-night-black border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="h-7 w-7 text-night-gold" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Specific Sections */}
      <section className="py-24 bg-night-black relative">
        <div className="container mx-auto px-4 space-y-32">
          
          {/* Employee Section */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="order-2 md:order-1"
             >
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-night-black via-transparent to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop" 
                    alt="DJ mixing" 
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute bottom-8 left-8 z-20">
                    <span className="px-4 py-1.5 rounded-full bg-night-purple text-white text-sm font-bold uppercase tracking-wider mb-3 inline-block shadow-lg shadow-night-purple/20">Candidat</span>
                    <h3 className="text-3xl font-bold text-white">Construisez votre carrière</h3>
                  </div>
                </div>
             </motion.div>
             
             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="space-y-8 order-1 md:order-2"
             >
               <h2 className="text-4xl md:text-5xl font-bold">Pour les <span className="text-night-purple">Talents</span></h2>
               <p className="text-gray-300 text-lg leading-relaxed">
                 Serveur, barman, DJ, agent de sécurité, hôtesse... Trouvez des missions et construisez votre carrière nocturne.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { icon: User, label: 'Profil professionnel' },
                   { icon: Send, label: 'Postuler en 1 clic' },
                   { icon: Clock, label: 'Historique missions' },
                   { icon: Star, label: 'Notation & Avis' }
                 ].map((feature, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                     <div className="h-10 w-10 rounded-full bg-night-purple/20 flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-night-purple" />
                     </div>
                     <span className="font-medium">{feature.label}</span>
                   </div>
                 ))}
               </div>
               
               <Button variant="employee" size="lg" className="h-14 px-8 text-lg" onClick={() => navigate('/auth?role=employee')}>
                 Créer mon profil candidat
               </Button>
             </motion.div>
          </div>

          {/* Employer Section */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="space-y-8"
             >
               <h2 className="text-4xl md:text-5xl font-bold">Pour les <span className="text-night-gold">Établissements</span></h2>
               <p className="text-gray-300 text-lg leading-relaxed">
                 Bar, club, lounge, snack-bar, restaurant... Recrutez et gérez votre personnel nocturne en toute simplicité.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { icon: PlusCircle, label: 'Publier des offres' },
                   { icon: Briefcase, label: 'Gestion missions' },
                   { icon: Calendar, label: 'Planning personnel' },
                   { icon: BarChart, label: 'Dashboard stats' }
                 ].map((feature, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                     <div className="h-10 w-10 rounded-full bg-night-gold/20 flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-night-gold" />
                     </div>
                     <span className="font-medium">{feature.label}</span>
                   </div>
                 ))}
               </div>
               
               <Button variant="employer" size="lg" className="h-14 px-8 text-lg" onClick={() => navigate('/auth?role=employer')}>
                 Créer mon compte recruteur
               </Button>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-night-black via-transparent to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1572116469696-9587f100631e?q=80&w=800&auto=format&fit=crop" 
                    alt="Bar interior" 
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute bottom-8 left-8 z-20">
                    <span className="px-4 py-1.5 rounded-full bg-night-gold text-black text-sm font-bold uppercase tracking-wider mb-3 inline-block shadow-lg shadow-night-gold/20">Recruteur</span>
                    <h3 className="text-3xl font-bold text-white">Gérez votre staff</h3>
                  </div>
                </div>
             </motion.div>
          </div>

        </div>
      </section>

      {/* Info & Location Section */}
      <section className="py-24 relative bg-gradient-to-b from-night-black to-black">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Basé à <span className="text-night-gold">Libreville</span>,<br/>
              Connecté partout.
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Nightlink connecte les professionnels de la nuit dans tout le Gabon. 
              Que vous soyez à Libreville, Port-Gentil ou Franceville, trouvez les meilleures opportunités 
              ou les meilleurs talents près de chez vous.
            </p>
            <ul className="space-y-4">
              {[
                'Inscription gratuite et rapide',
                'Vérification rigoureuse des profils',
                'Paiements sécurisés et garantis',
                'Support disponible 24/7'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-400">
                  <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="text-green-500 h-3.5 w-3.5" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Google Map Embed */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[450px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-night-black"
          >
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63826.73249767755!2d9.40632556972236!3d0.4161978280629553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x107f3b9c3b3b3b3b%3A0x3b3b3b3b3b3b3b3b!2sLibreville%2C%20Gabon!5e0!3m2!1sen!2sga!4v1677000000000!5m2!1sen!2sga" 
               width="100%" 
               height="100%" 
               style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }} 
               allowFullScreen 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               title="Map Libreville"
             ></iframe>
             <div className="absolute bottom-6 left-6 bg-black/80 p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-xl">
                <div className="flex items-center gap-3 text-white font-medium">
                  <div className="h-8 w-8 rounded-full bg-night-gold/20 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-night-gold" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Siège Social</div>
                    <div className="text-xs text-gray-400">Libreville, Gabon</div>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="space-y-6">
              <h3 className="text-3xl font-black bg-gradient-to-r from-night-purple to-night-gold bg-clip-text text-transparent">
                NIGHTLINK
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                La solution digitale pour révolutionner le monde de la nuit au Gabon.
                Recrutement, gestion et opportunités en un seul clic.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    className={`h-10 w-10 rounded-full bg-white/5 flex items-center justify-center transition-colors ${social.color} hover:bg-white/10`}
                    title={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-lg">Navigation</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-night-gold transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-night-gold transition-colors">Comment ça marche</a></li>
                <li><a href="#" className="hover:text-night-gold transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-night-gold transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-night-gold transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-lg">Contact & Partenaires</h4>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-start gap-3">
                  <Code className="h-5 w-5 text-night-purple mt-0.5" />
                  <div>
                    <span className="block text-white font-medium">Dev_Consulting</span>
                    <span className="text-xs">Partenaire Ludo_Consulting</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-night-purple" />
                  <a href="mailto:Ludo.Consulting3@gmail.com" className="hover:text-white transition-colors">Ludo.Consulting3@gmail.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-night-purple" />
                  <span>077 02 23 06 / 062 64 11 20</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-night-purple" />
                  <span>Libreville, Gabon</span>
                </div>
              </div>
            </div>

            {/* Developer Credit */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-lg">Développement</h4>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-night-purple/30 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                    DL
                  </div>
                  <div>
                    <div className="font-bold text-white">Dev_Ludovic</div>
                    <div className="text-xs text-night-gold uppercase font-bold tracking-wider">Full Stack Dev</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Expert Mobile & Web<br/>
                  React Native • Node.js • React<br/>
                  <span className="text-gray-500 italic mt-1 block">"Programmer l'avenir"</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600">
            <p>&copy; 2025 Nightlink. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-400 transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-gray-400 transition-colors">CGU</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
