import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebase/config";

export default function TaskerServices() {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    checkTaskerProfile();
  }, []);

  const checkTaskerProfile = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "taskers"));
      const userTaskerProfile = querySnapshot.docs.find(
        doc => doc.data().userId === auth.currentUser?.uid
      );
      setHasProfile(!!userTaskerProfile);
    } catch (error) {
      alert("Error checking profile");
    }
  };

  const handleServiceSelect = (service) => {
    if (!hasProfile) {
      router.push("/tasker-register");
    } else {
      switch(service) {
        case "meals":
          router.push("/tasker-dashboard");
          break;
        case "pets":
          alert("Pet sitting service coming soon!");
          break;
        case "cleaning":
          alert("Cleaning service coming soon!");
          break;
        case "tasks":
          alert("Other tasks service coming soon!");
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Choose Your Service</Text>
      <Text style={styles.subtitle}>
        {hasProfile 
          ? "Manage your services" 
          : "Register as a tasker first to offer services"
        }
      </Text>
      
      <ScrollView style={styles.cardsContainer}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => handleServiceSelect("meals")}
        >
          <Text style={styles.cardIcon}>🍛</Text>
          <Text style={styles.cardTitle}>Home Cooked Meals</Text>
          <Text style={styles.cardDescription}>Offer your home-cooked meals</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => handleServiceSelect("pets")}
        >
          <Text style={styles.cardIcon}>🐕</Text>
          <Text style={styles.cardTitle}>Pet Sitting</Text>
          <Text style={styles.cardDescription}>Offer pet care services</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => handleServiceSelect("cleaning")}
        >
          <Text style={styles.cardIcon}>🧹</Text>
          <Text style={styles.cardTitle}>Cleaning Service</Text>
          <Text style={styles.cardDescription}>Offer cleaning services</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => handleServiceSelect("tasks")}
        >
          <Text style={styles.cardIcon}>📋</Text>
          <Text style={styles.cardTitle}>Other Tasks</Text>
          <Text style={styles.cardDescription}>Offer various odd jobs</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#0a0a0a" 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 10, 
    marginTop: 50,
    color: "#ffffff",
    textAlign: "center"
  },
  subtitle: { 
    fontSize: 16, 
    color: "#888", 
    marginBottom: 30,
    textAlign: "center"
  },
  backButton: { 
    position: "absolute", 
    top: 50, 
    left: 20 
  },
  backButtonText: { 
    color: "#007AFF", 
    fontSize: 16 
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
    borderColor: "#2c2c2e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
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
  }
});
