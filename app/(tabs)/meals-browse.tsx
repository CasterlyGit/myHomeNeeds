import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function MealsBrowse() {
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCooks();
  }, []);

  const fetchCooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "taskers"));
      const cooksData = [];
      querySnapshot.forEach((doc) => {
        cooksData.push({ id: doc.id, ...doc.data() });
      });
      setCooks(cooksData);
    } catch (error) {
      alert("Error loading cooks");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading home cooks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Available Home Cooks</Text>
      <Text style={styles.subtitle}>Local cooks offering home-cooked meals</Text>
      
      {cooks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No home cooks available yet</Text>
          <Text style={styles.emptySubtext}>Check back later!</Text>
        </View>
      ) : (
        <ScrollView style={styles.cooksList}>
          {cooks.map((cook) => (
            <TouchableOpacity 
              key={cook.id} 
              style={styles.cookCard}
              onPress={() => router.push(`/cook-menu?id=${cook.id}`)}
            >
              <Text style={styles.cookName}>{cook.name}</Text>
              <Text style={styles.cookServices}>{cook.services}</Text>
              <Text style={styles.cookAbout}>{cook.about}</Text>
              <Text style={styles.viewMenuText}>View Menu →</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    color: "#ffffff"
  },
  subtitle: { 
    fontSize: 16, 
    color: "#888", 
    marginBottom: 30 
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
  cooksList: { 
    flex: 1 
  },
  cookCard: { 
    backgroundColor: "#1c1c1e", 
    padding: 20, 
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
  cookName: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 8,
    color: "#ffffff" 
  },
  cookServices: { 
    fontSize: 16, 
    color: "#aaa", 
    marginBottom: 8,
    fontWeight: "500"
  },
  cookAbout: { 
    fontSize: 14, 
    color: "#888", 
    marginBottom: 12,
    lineHeight: 20
  },
  viewMenuText: { 
    fontSize: 14, 
    color: "#007AFF", 
    fontWeight: "600" 
  },
  emptyState: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  emptyText: { 
    fontSize: 18, 
    color: "#666", 
    marginBottom: 10 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: "#999" 
  },
  loadingText: { 
    marginTop: 10, 
    color: "#666",
    textAlign: "center"
  }
});
