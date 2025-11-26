import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { db, auth } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function MealListing() {
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cuisine, setCuisine] = useState("");

  const addMeal = async () => {
    if (!mealName || !price || !cuisine) {
      Alert.alert("Error", "Please fill in meal name, price, and cuisine");
      return;
    }

    try {
      await addDoc(collection(db, "meals"), {
        mealName,
        description,
        price: parseFloat(price),
        cuisine,
        cookId: auth.currentUser?.uid,  // CHANGED: using cookId instead of userId
        cookName: auth.currentUser?.email,
        createdAt: new Date(),
        status: "available"
      });
      Alert.alert("Success", "Meal added to your menu!");
      router.push("/");
    } catch (error) {
      Alert.alert("Error", "Failed to add meal");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Add Your Meal</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Meal Name *" 
        value={mealName}
        onChangeText={setMealName}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Cuisine *" 
        value={cuisine}
        onChangeText={setCuisine}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Price ($) *" 
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />
      <TextInput 
        style={styles.bigInput} 
        placeholder="Description" 
        value={description}
        onChangeText={setDescription}
        multiline 
        numberOfLines={3} 
      />
      
      <TouchableOpacity style={styles.button} onPress={addMeal}>
        <Text style={styles.buttonText}>Add to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center", marginTop: 50 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 15, borderRadius: 8, marginBottom: 15 },
  bigInput: { borderWidth: 1, borderColor: "#ddd", padding: 15, borderRadius: 8, marginBottom: 15, height: 80 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  backButton: { position: "absolute", top: 50, left: 20 },
  backButtonText: { color: "#007AFF", fontSize: 16 }
});
