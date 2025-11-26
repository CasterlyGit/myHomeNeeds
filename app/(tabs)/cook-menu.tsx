import { router, useLocalSearchParams } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebase/config";

export default function CookMenu() {
  const { id: cookId } = useLocalSearchParams();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cook, setCook] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!cookId) {
      Alert.alert("Error", "No cook selected");
      router.back();
      return;
    }

    // Fetch cook details
    const fetchCook = async () => {
      try {
        // You might need to adjust this based on your data structure
        const cookQuery = query(
          collection(db, "taskers"),
          where("userId", "==", cookId)
        );
        
        const unsubscribeCook = onSnapshot(cookQuery, (snapshot) => {
          if (!snapshot.empty) {
            const cookData = snapshot.docs[0].data();
            setCook(cookData);
          }
        });

        return unsubscribeCook;
      } catch (error) {
        console.error("Error fetching cook:", error);
      }
    };

    // Fetch meals for this cook
    const mealsQuery = query(
      collection(db, "meals"),
      where("cookId", "==", cookId),
      where("available", "==", true)
    );
    
    const unsubscribeMeals = onSnapshot(mealsQuery, (snapshot) => {
      const mealsData = [];
      snapshot.forEach((doc) => {
        mealsData.push({ id: doc.id, ...doc.data() });
      });
      setMeals(mealsData);
      setLoading(false);
    });

    fetchCook();

    return () => {
      // Cleanup listeners if needed
    };
  }, [cookId]);

  const handleOrder = (meal) => {
    if (!user) {
      Alert.alert(
        "Login Required",
        "Please login to place an order",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    router.push(`/meal-listing?id=${meal.id}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      {cook && (
        <View style={styles.cookHeader}>
          <Text style={styles.cookName}>{cook.name}'s Menu</Text>
          <Text style={styles.cookServices}>{cook.services}</Text>
          <Text style={styles.cookAbout}>{cook.about}</Text>
        </View>
      )}
      
      <Text style={styles.menuTitle}>Available Meals</Text>
      
      {meals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No meals available</Text>
          <Text style={styles.emptySubtext}>This cook hasn't added any meals yet</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.mealCard}
              onPress={() => handleOrder(item)}
            >
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{item.name}</Text>
                <Text style={styles.mealPrice}>${item.price?.toFixed(2)}</Text>
              </View>
              
              <Text style={styles.mealDescription}>{item.description}</Text>
              
              <View style={styles.mealFooter}>
                <Text style={styles.cookInfo}>By {cook?.name}</Text>
                <Text style={styles.orderText}>Tap to Order →</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
  backButton: { 
    position: "absolute", 
    top: 50, 
    left: 20,
    zIndex: 1
  },
  backButtonText: { 
    color: "#007AFF", 
    fontSize: 16 
  },
  cookHeader: {
    backgroundColor: "#1c1c1e",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 50,
    borderWidth: 1,
    borderColor: "#2c2c2e"
  },
  cookName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8
  },
  cookServices: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 8
  },
  cookAbout: {
    fontSize: 14,
    color: "#888",
    lineHeight: 20
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16
  },
  mealCard: {
    backgroundColor: "#1c1c1e",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1
  },
  mealPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginLeft: 10
  },
  mealDescription: {
    fontSize: 14,
    color: "#888",
    lineHeight: 20,
    marginBottom: 12
  },
  mealFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cookInfo: {
    fontSize: 14,
    color: "#aaa"
  },
  orderText: {
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