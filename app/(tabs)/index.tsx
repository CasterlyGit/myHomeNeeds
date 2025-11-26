import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";

export default function HomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      alert("Error signing out");
    }
  };

  const checkTaskerProfile = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "taskers"));
      const userTaskerProfile = querySnapshot.docs.find(
        doc => doc.data().userId === auth.currentUser?.uid
      );
      
      if (userTaskerProfile) {
        router.push("/tasker-services");
      } else {
        router.push("/tasker-register");
      }
    } catch (error) {
      alert("Error checking profile");
    }
  };

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
      <View style={styles.header}>
        <Text style={styles.title}>myHomeNeeds</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => router.push("/settings")} style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.subtitle}>Get things done, the easy way</Text>
      
      <ScrollView style={styles.cardsContainer}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push("/meals-browse")}
        >
          <Text style={styles.cardIcon}>🍛</Text>
          <Text style={styles.cardTitle}>Home Cooked Meals</Text>
          <Text style={styles.cardDescription}>Fresh meals from local cooks</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push("/user-orders")}
        >
          <Text style={styles.cardIcon}>📦</Text>
          <Text style={styles.cardTitle}>My Orders</Text>
          <Text style={styles.cardDescription}>Track your food orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>🐕</Text>
          <Text style={styles.cardTitle}>Pet Sitting</Text>
          <Text style={styles.cardDescription}>Trusted pet care</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>🧹</Text>
          <Text style={styles.cardTitle}>Cleaning Service</Text>
          <Text style={styles.cardDescription}>Spotless cleaning</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>📋</Text>
          <Text style={styles.cardTitle}>Other Tasks</Text>
          <Text style={styles.cardDescription}>Any odd job you need</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity 
        style={styles.taskerButton}
        onPress={checkTaskerProfile}
      >
        <Text style={styles.taskerButtonText}>Are you a Tasker? Click here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#0a0a0a" 
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 10 
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center"
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#ffffff" 
  },
  settingsButton: {
    marginRight: 15
  },
  settingsButtonText: {
    fontSize: 20,
    color: "#ffffff"
  },
  logoutText: { 
    color: "#007AFF", 
    fontSize: 16 
  },
  subtitle: { 
    fontSize: 16, 
    color: "#888", 
    marginBottom: 30 
  },
  cardsContainer: {
    flex: 1,
  },
  card: { 
    backgroundColor: "#1c1c1e", 
    padding: 25, 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2c2c2e"
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12
  },
  cardTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 8,
    color: "#ffffff" 
  },
  cardDescription: { 
    fontSize: 14, 
    color: "#aaa",
    lineHeight: 20 
  },
  taskerButton: { 
    backgroundColor: "#007AFF", 
    padding: 18, 
    borderRadius: 12, 
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10
  },
  taskerButtonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16
  }
});
