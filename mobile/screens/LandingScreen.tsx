import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Music, Coffee, Shield, Star } from 'lucide-react-native';

export default function LandingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920&auto=format&fit=crop' }}
          style={styles.heroBackground}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', '#000000']}
            style={styles.gradientOverlay}
          >
            <SafeAreaView style={styles.heroContent}>
              <Text style={styles.title}>NIGHTLINK</Text>
              <Text style={styles.subtitle}>
                La plateforme de référence pour le recrutement et la gestion de la vie nocturne au Gabon.
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.employeeButton]}
                  onPress={() => navigation.navigate('Auth', { role: 'employee' })}
                >
                  <Text style={styles.buttonText}>Je cherche un job</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.employerButton]}
                  onPress={() => navigation.navigate('Auth', { role: 'employer' })}
                >
                  <Text style={[styles.buttonText, { color: '#000' }]}>Je recrute</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Tout pour la <Text style={{ color: '#8B5CF6' }}>Nightlife</Text></Text>
          
          <View style={styles.featureGrid}>
            <FeatureItem icon={Music} title="DJs & Artistes" desc="Trouvez les meilleurs talents." />
            <FeatureItem icon={Coffee} title="Bar & Service" desc="Service impeccable." />
            <FeatureItem icon={Shield} title="Sécurité" desc="Assurez la sécurité." />
            <FeatureItem icon={Star} title="Hôtesses" desc="Accueil VIP." />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const FeatureItem = ({ icon: Icon, title, desc }: any) => (
  <View style={styles.featureCard}>
    <View style={styles.iconContainer}>
      <Icon color="#F59E0B" size={24} />
    </View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDesc}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroBackground: {
    height: 600,
    width: '100%',
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: 'transparent', // Gradient text not supported directly in RN without libraries, using fallback
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  employeeButton: {
    backgroundColor: '#7C3AED', // night-purple
  },
  employerButton: {
    backgroundColor: '#F59E0B', // night-gold
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuresSection: {
    padding: 24,
    backgroundColor: '#000',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  featureCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
