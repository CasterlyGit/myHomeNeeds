import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebase/config";

export default function MealListing() {
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cuisine, setCuisine] = useState("");

  const addMeal = async () => {
    if (!mealName?.trim()) {
      Alert.alert("Error", "Please enter a meal name");
      return;
    }
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }
    
    if (!cuisine?.trim()) {
      Alert.alert("Error", "Please enter a cuisine type");
      return;
    }
    
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
        cookId: auth.currentUser?.uid,
        cookName: auth.currentUser?.email,
        createdAt: new Date(),
        status: "available"
      });
      Alert.alert("Success", "Meal added to your menu!");
      // Go back to tasker dashboard instead of home
      router.push("/tasker-dashboard");
    } catch (error) {
      Alert.alert("Error", "Failed to add meal");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/tasker-dashboard")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Add Your Meal</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Meal Name *" 
        placeholderTextColor="#888"
        value={mealName}
        onChangeText={setMealName}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Cuisine *" 
        placeholderTextColor="#888"
        value={cuisine}
        onChangeText={setCuisine}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Price ($) *" 
        placeholderTextColor="#888"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />
      <TextInput 
        style={styles.bigInput} 
        placeholder="Description" 
        placeholderTextColor="#888"
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
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#0a0a0a" 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 30, 
    textAlign: "center", 
    marginTop: 50,
    color: "#ffffff"
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#2c2c2e", 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16,
    backgroundColor: "#1c1c1e",
    color: "#ffffff",
    fontSize: 16
  },
  bigInput: { 
    borderWidth: 1, 
    borderColor: "#2c2c2e", 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16, 
    height: 100,
    backgroundColor: "#1c1c1e",
    color: "#ffffff",
    fontSize: 16,
    textAlignVertical: 'top'
  },
  button: { 
    backgroundColor: "#007AFF", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  backButton: { 
    position: "absolute", 
    top: 50, 
    left: 20 
  },
  backButtonText: { 
    color: "#007AFF", 
    fontSize: 16 
  }
});
