import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

export default function TaskerDashboard() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kitchenName, setKitchenName] = useState("My Kitchen");

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Fetch kitchen name from tasker profile
      const taskersQuery = query(
        collection(db, "taskers"), 
        where("userId", "==", currentUser.uid)
      );
      const taskerSnapshot = await getDocs(taskersQuery);
      if (!taskerSnapshot.empty) {
        const taskerData = taskerSnapshot.docs[0].data();
        setKitchenName(taskerData.kitchenName || taskerData.name + "'s Kitchen");
      }

      // Fetch meals
      const mealsQuery = query(
        collection(db, "meals"), 
        where("cookId", "==", currentUser.uid)
      );
      const mealsSnapshot = await getDocs(mealsQuery);
      const mealsData = [];
      mealsSnapshot.forEach((doc) => {
        mealsData.push({ id: doc.id, ...doc.data() });
      });
      setMeals(mealsData);
    } catch (error) {
      alert("Error loading your data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/tasker-services")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>{kitchenName}</Text>
      <Text style={styles.subtitle}>Manage your home-cooked meals</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/meal-listing")}
        >
          <Text style={styles.addButtonText}>+ Add New Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.ordersButton}
          onPress={() => router.push("/tasker-orders")}
        >
          <Text style={styles.ordersButtonText}>📦 Orders</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.settingsButtonText}>⚙️ Edit Kitchen Settings</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Meals ({meals.length})</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : meals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No meals yet</Text>
          <Text style={styles.emptySubtext}>Add your first meal to get started!</Text>
        </View>
      ) : (
        <ScrollView style={styles.mealsList}>
          {meals.map((meal) => (
            <TouchableOpacity 
              key={meal.id} 
              style={styles.mealCard}
              onPress={() => router.push(`/meal-edit?id=${meal.id}`)}
            >
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.mealName}</Text>
                <View style={styles.priceBox}>
                  <Text style={styles.mealPrice}>${meal.price}</Text>
                </View>
              </View>
              <Text style={styles.mealCuisine}>{meal.cuisine}</Text>
              <Text style={styles.mealDescription}>{meal.description}</Text>
              <Text style={styles.editText}>Tap to edit →</Text>
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
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 20, 
    marginTop: 20,
    color: "#ffffff"
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  addButton: { 
    backgroundColor: "#007AFF", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center",
    flex: 1,
    marginRight: 10
  },
  addButtonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  ordersButton: { 
    backgroundColor: "#FF9500", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center",
    flex: 1,
    marginLeft: 10
  },
  ordersButtonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  settingsButton: {
    backgroundColor: "#1c1c1e",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2c2c2e",
    marginBottom: 20
  },
  settingsButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600"
  },
  mealsList: { 
    flex: 1 
  },
  mealCard: { 
    backgroundColor: "#1c1c1e", 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2c2c2e"
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8
  },
  mealName: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#ffffff",
    flex: 1,
    marginRight: 12
  },
  priceBox: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 70
  },
  mealPrice: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "white",
    textAlign: "center"
  },
  mealCuisine: { 
    fontSize: 16, 
    color: "#aaa", 
    marginBottom: 8,
    fontWeight: "500"
  },
  mealDescription: { 
    fontSize: 15, 
    color: "#ccc",
    lineHeight: 20,
    marginBottom: 12
  },
  editText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    textAlign: "right"
  },
  emptyState: { 
    alignItems: "center", 
    padding: 40 
  },
  emptyText: { 
    fontSize: 18, 
    color: "#666", 
    marginBottom: 5 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: "#999" 
  }
});
