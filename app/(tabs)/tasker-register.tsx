import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { db, auth } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function TaskerRegister() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState("");
  const [about, setAbout] = useState("");

  const registerAsTasker = async () => {
    if (!name || !phone || !services) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      await addDoc(collection(db, "taskers"), {
        name,
        phone,
        services,
        about,
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        createdAt: new Date(),
        type: "cook"
      });
      Alert.alert("Success", "You're now registered as a home cook!");
      router.replace("/tasker-dashboard");
    } catch (error) {
      Alert.alert("Error", "Failed to register");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Become a Home Cook</Text>
      <Text style={styles.subtitle}>Share your home-cooked meals with the community</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Your Name *" 
        value={name}
        onChangeText={setName}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Phone Number *" 
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput 
        style={styles.input} 
        placeholder="What do you cook? *" 
        value={services}
        onChangeText={setServices}
      />
      <TextInput 
        style={styles.bigInput} 
        placeholder="Tell us about your cooking style..." 
        value={about}
        onChangeText={setAbout}
        multiline 
        numberOfLines={4} 
      />
      
      <TouchableOpacity style={styles.button} onPress={registerAsTasker}>
        <Text style={styles.buttonText}>Register as Home Cook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, textAlign: "center", marginTop: 50 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 30, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 15, borderRadius: 8, marginBottom: 15 },
  bigInput: { borderWidth: 1, borderColor: "#ddd", padding: 15, borderRadius: 8, marginBottom: 15, height: 100 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  backButton: { position: "absolute", top: 50, left: 20 },
  backButtonText: { color: "#007AFF", fontSize: 16 }
});
