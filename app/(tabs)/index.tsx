import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebase/config";
import BottomDock from "./BottomDock";

export default function HomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Auto-redirect if no user
      if (!user) {
        router.replace("/login");
      }
    });
    return unsubscribe;
  }, []);

  // If user is not logged in, redirect to login
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>myHomeNeeds</Text>
          <Text style={styles.heroSubtitle}>Your neighborhood marketplace for everything home</Text>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeEmoji}>👋</Text>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeText}>
            Get things done the easy way. From home-cooked meals to pet sitting, we've got your back.
          </Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🍽️</Text>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Local Cooks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={styles.statNumber}>1K+</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose Us?</Text>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>✨</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Quality You Can Trust</Text>
              <Text style={styles.featureDescription}>
                All our taskers are verified and rated by the community
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>💰</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Fair Pricing</Text>
              <Text style={styles.featureDescription}>
                Support local talent at prices that work for everyone
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🚀</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Fast & Easy</Text>
              <Text style={styles.featureDescription}>
                Book services in seconds, get help when you need it
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to get started?</Text>
          <Text style={styles.ctaSubtitle}>Tap the 🏠 Home icon below to browse services</Text>
        </View>
      </ScrollView>

      <BottomDock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0a0a0a" 
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120 // Extra padding for dock
  },
  heroSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center"
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
    textAlign: "center"
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 22
  },
  welcomeCard: {
    backgroundColor: "#1c1c1e",
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2c2c2e",
    marginBottom: 30
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: 15
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10
  },
  welcomeText: {
    fontSize: 15,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 22
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 40
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2c2c2e"
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    textAlign: "center"
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 40
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20
  },
  featureItem: {
    flexDirection: "row",
    backgroundColor: "#1c1c1e",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2c2c2e"
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16
  },
  featureIcon: {
    fontSize: 24
  },
  featureContent: {
    flex: 1,
    justifyContent: "center"
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4
  },
  featureDescription: {
    fontSize: 14,
    color: "#aaa",
    lineHeight: 20
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center"
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center"
  },
  ctaSubtitle: {
    fontSize: 15,
    color: "#888",
    textAlign: "center"
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 50
  }
});