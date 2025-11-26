import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebase/config";

export default function TaskerRegister() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState("");
  const [about, setAbout] = useState("");

  const registerAsTasker = async () => {
    if (!name?.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    
    if (!phone?.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    
    if (!services?.trim()) {
      Alert.alert("Error", "Please describe what you cook");
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
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Phone Number *" 
        placeholderTextColor="#888"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput 
        style={styles.input} 
        placeholder="What do you cook? *" 
        placeholderTextColor="#888"
        value={services}
        onChangeText={setServices}
      />
      <TextInput 
        style={styles.bigInput} 
        placeholder="Tell us about your cooking style..." 
        placeholderTextColor="#888"
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
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#0a0a0a" 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center", 
    marginTop: 50,
    color: "#ffffff"
  },
  subtitle: { 
    fontSize: 16, 
    color: "#888", 
    marginBottom: 30, 
    textAlign: "center" 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#2c2c2e", 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15,
    backgroundColor: "#1c1c1e",
    color: "#ffffff",
    fontSize: 16
  },
  bigInput: { 
    borderWidth: 1, 
    borderColor: "#2c2c2e", 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15, 
    height: 100,
    backgroundColor: "#1c1c1e",
    color: "#ffffff",
    fontSize: 16,
    textAlignVertical: 'top'
  },
  button: { 
    backgroundColor: "#007AFF", 
    padding: 15, 
    borderRadius: 8, 
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