import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function MealsBrowse() {
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCooksWithMeals();
  }, []);

  const fetchCooksWithMeals = async () => {
    try {
      // Get all taskers
      const taskersSnapshot = await getDocs(collection(db, "taskers"));
      const cooksData = [];
      
      // Check each tasker if they have meals
      for (const doc of taskersSnapshot.docs) {
        const taskerData = doc.data();
        
        // Try both userId and id fields
        const cookId = taskerData.userId || taskerData.id || doc.id;
        
        // Check if tasker has meals
        const mealsQuery = query(
          collection(db, "meals"), 
          where("cookId", "==", cookId)
        );
        const mealsSnapshot = await getDocs(mealsQuery);
        
        // Only include cooks who have at least one meal
        if (mealsSnapshot.size > 0) {
          cooksData.push({ 
            id: doc.id, 
            ...taskerData,
            mealCount: mealsSnapshot.size
          });
        }
      }
      
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
              <View style={styles.cookHeader}>
                <Text style={styles.cookName}>{cook.name}</Text>
                <View style={styles.openBadge}>
                  <Text style={styles.openText}>🟢 OPEN</Text>
                </View>
              </View>
              <Text style={styles.cookServices}>{cook.services}</Text>
              <Text style={styles.cookAbout}>{cook.about}</Text>
              <Text style={styles.mealCount}>{cook.mealCount} meals available</Text>
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
    borderColor: "#2c2c2e"
  },
  cookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8
  },
  cookName: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#ffffff",
    flex: 1
  },
  openBadge: {
    backgroundColor: "#34C759",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  openText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600"
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
    marginBottom: 8,
    lineHeight: 20
  },
  mealCount: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 8
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
