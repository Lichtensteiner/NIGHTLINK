import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Smartphone, QrCode, Terminal, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const MobileApp = () => {
  const [expoUrl, setExpoUrl] = useState('exp://192.168.1.10:8081');
  const [qrSrc, setQrSrc] = useState(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=exp://192.168.1.10:8081`);

  const handleGenerateQr = () => {
    setQrSrc(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(expoUrl)}`);
  };

  return (
    <div className="min-h-screen bg-night-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-night-purple/20 mb-4"
          >
            <Smartphone className="h-8 w-8 text-night-purple" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-night-purple via-white to-night-gold bg-clip-text text-transparent">
            Nightlink Mobile
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Emportez Nightlink partout avec vous. Disponible sur iOS et Android via Expo.
          </p>
        </div>

        {/* Instructions Card */}
        <Card className="p-8 bg-white/5 border-white/10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Terminal className="h-6 w-6 text-night-gold" />
                Comment lancer l'app ?
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-bold">Prérequis</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Installez l'application <span className="text-white font-medium">Expo Go</span> sur votre téléphone (App Store ou Play Store).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-bold">Installation</h3>
                    <div className="mt-2 p-3 rounded-lg bg-black font-mono text-xs text-green-400 border border-white/10">
                      cd mobile<br/>
                      npm install
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-bold">Lancement</h3>
                    <div className="mt-2 p-3 rounded-lg bg-black font-mono text-xs text-green-400 border border-white/10">
                      npx expo start
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-bold">Scan</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Copiez l'URL affichée dans votre terminal (ex: exp://...) et collez-la ci-contre pour générer le QR Code.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Generator */}
            <div className="flex flex-col items-center justify-center space-y-6 p-8 rounded-3xl bg-black/50 border border-white/5">
              <div className="relative p-4 bg-white rounded-xl">
                <img 
                  src={qrSrc} 
                  alt="Expo QR Code" 
                  className="w-48 h-48 object-contain"
                />
              </div>
              
              <div className="w-full space-y-3">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                  URL Expo (depuis votre terminal)
                </label>
                <div className="flex gap-2">
                  <Input 
                    value={expoUrl}
                    onChange={(e) => setExpoUrl(e.target.value)}
                    placeholder="exp://192.168.1.x:8081"
                    className="bg-white/5 border-white/10 text-sm font-mono"
                  />
                  <Button onClick={handleGenerateQr} size="icon" variant="ghost" className="border border-white/10">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-center text-xs text-gray-500">
                Scannez ce code avec l'application Expo Go sur Android<br/>ou l'appareil photo sur iOS.
              </p>
            </div>

          </div>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            'Notifications temps réel',
            'Géolocalisation des missions',
            'Chat intégré'
          ].map((feature, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
