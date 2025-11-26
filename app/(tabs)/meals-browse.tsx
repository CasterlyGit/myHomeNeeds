import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Colors, Components, Layout, Typography } from "../../constants";
import { auth, db } from "../../firebase/config";
import { styles } from "./meals-browse.styles";

export default function MealsBrowse() {
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    fetchCooksWithMeals();

    return unsubscribeAuth;
  }, []);

  const fetchCooksWithMeals = async () => {
    try {
      console.log("🔍 Starting fetchCooksWithMeals...");
      
      // First, get all available meals
      const mealsQuery = query(
        collection(db, "meals"),
        where("status", "==", "available")
      );
      
      const mealsSnapshot = await getDocs(mealsQuery);
      console.log("Available meals found:", mealsSnapshot.size);
      
      // Get unique cook IDs from available meals
      const cookIds = [...new Set(mealsSnapshot.docs.map(doc => doc.data().cookId))];
      console.log("Unique cook IDs from meals:", cookIds);
      
      if (cookIds.length === 0) {
        console.log("No cooks found with available meals");
        setCooks([]);
        setLoading(false);
        return;
      }
      
      // Get cook details for each cook ID
      const cooksData = [];
      
      for (const cookId of cookIds) {
        console.log("Fetching cook details for:", cookId);
        
        const cookQuery = query(
          collection(db, "taskers"),
          where("userId", "==", cookId)
        );
        
        const cookSnapshot = await getDocs(cookQuery);
        
        if (!cookSnapshot.empty) {
          const cookData = cookSnapshot.docs[0].data();
          const mealCount = mealsSnapshot.docs.filter(doc => doc.data().cookId === cookId).length;
          
          cooksData.push({
            id: cookSnapshot.docs[0].id,
            ...cookData,
            mealCount: mealCount
          });
          
          console.log("✅ Found cook:", cookData.name);
        } else {
          console.log("❌ No cook found for userId:", cookId);
        }
      }
      
      console.log("Final cooks data:", cooksData);
      setCooks(cooksData);
      
    } catch (error) {
      console.error("Error in fetchCooksWithMeals:", error);
      Alert.alert("Error", "Failed to load cooks: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCookPress = (cook) => {
    if (!user) {
      Alert.alert(
        "Login Required",
        "Please login to view cook's menu",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    router.push(`/cook-menu?id=${cook.userId}`);
  };

  if (loading) {
    return (
      <View style={Layout.container}>
        <ActivityIndicator size="large" color={Colors.text.accent} />
        <Text style={styles.loadingText}>Loading home cooks...</Text>
      </View>
    );
  }

  return (
    <View style={Layout.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={Typography.title2}>Available Home Cooks</Text>
      <Text style={Typography.subtitle}>Local cooks offering home-cooked meals</Text>
      
      {cooks.length === 0 ? (
        <View style={Components.emptyState}>
          <Text style={styles.emptyText}>No home cooks available yet</Text>
          <Text style={styles.emptySubtext}>Check back later or add some meals!</Text>
        </View>
      ) : (
        <ScrollView style={Layout.scrollView} contentContainerStyle={styles.scrollContent}>
          {cooks.map((cook) => (
            <TouchableOpacity 
              key={cook.id} 
              style={styles.cookCard}
              onPress={() => handleCookPress(cook)}
            >
              <View style={styles.cookHeader}>
                <View style={styles.cookNameContainer}>
                  <Text style={styles.cookName}>{cook.name}</Text>
                  {cook.kitchenName && (
                    <Text style={styles.kitchenName}>{cook.kitchenName}</Text>
                  )}
                </View>
                <View style={styles.openBadge}>
                  <Text style={styles.openText}>OPEN</Text>
                </View>
              </View>
              
              <Text style={styles.cookServices}>Specializes in: {cook.services}</Text>
              
              {cook.about && (
                <Text style={styles.cookAbout}>{cook.about}</Text>
              )}
              
              <View style={styles.cookFooter}>
                <Text style={styles.mealCount}>{cook.mealCount} meals available</Text>
                <Text style={styles.viewMenuText}>View Menu →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}