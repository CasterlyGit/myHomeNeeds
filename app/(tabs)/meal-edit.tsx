import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default function MealEdit() {
  const { id } = useLocalSearchParams();
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeal();
  }, [id]);

  const fetchMeal = async () => {
    try {
      const docRef = doc(db, "meals", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const mealData = docSnap.data();
        setMealName(mealData.mealName);
        setDescription(mealData.description);
        setPrice(mealData.price.toString());
        setCuisine(mealData.cuisine);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load meal");
    } finally {
      setLoading(false);
    }
  };

  const updateMeal = async () => {
    if (!mealName || !price || !cuisine) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const docRef = doc(db, "meals", id);
      await updateDoc(docRef, {
        mealName,
        description,
        price: parseFloat(price),
        cuisine,
        updatedAt: new Date()
      });
      Alert.alert("Success", "Meal updated!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update meal");
    }
  };

  const deleteMeal = async () => {
    Alert.alert(
      "Delete Meal",
      "Are you sure you want to delete this meal?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "meals", id));
              Alert.alert("Success", "Meal deleted!");
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete meal");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Edit Meal</Text>
      
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
      
      <TouchableOpacity style={styles.updateButton} onPress={updateMeal}>
        <Text style={styles.buttonText}>Update Meal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={deleteMeal}>
        <Text style={styles.deleteButtonText}>Delete Meal</Text>
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
  updateButton: { 
    backgroundColor: "#007AFF", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center",
    marginBottom: 12
  },
  deleteButton: { 
    backgroundColor: "transparent", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff3b30"
  },
  buttonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  deleteButtonText: { 
    color: "#ff3b30", 
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
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center"
  }
});
