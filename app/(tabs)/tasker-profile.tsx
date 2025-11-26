import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function TaskerProfile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState("");
  const [about, setAbout] = useState("");

  const saveProfile = async () => {
    try {
      await addDoc(collection(db, "taskers"), {
        name,
        phone,
        services,
        about,
        createdAt: new Date()
      });
      Alert.alert("Success", "Profile saved!");
      router.push("/");
    } catch (error) {
      Alert.alert("Error", "Failed to save profile");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Tasker Profile</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Your Name" 
        value={name}
        onChangeText={setName}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Phone Number" 
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Services (e.g., Cooking, Cleaning)" 
        value={services}
        onChangeText={setServices}
      />
      <TextInput 
        style={styles.bigInput} 
        placeholder="About you..." 
        value={about}
        onChangeText={setAbout}
        multiline 
        numberOfLines={4} 
      />
      
      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.mealButton} onPress={() => router.push("/meal-listing")}>
        <Text style={styles.mealButtonText}>Add Home Cooked Meal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center", marginTop: 50 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 15, borderRadius: 8, marginBottom: 15 },
  bigInput: { borderWidth: 1, borderColor: "#ddd", padding: 15, borderRadius: 8, marginBottom: 15, height: 100 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  mealButton: { backgroundColor: "#FF9500", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  mealButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  backButton: { position: "absolute", top: 50, left: 20 },
  backButtonText: { color: "#007AFF", fontSize: 16 }
});
