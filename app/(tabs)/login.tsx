import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.replace("/");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        router.replace("/");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to myHomeNeeds</Text>
      <Text style={styles.subtitle}>{isLogin ? "Login to continue" : "Create your account"}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? "Need an account? Sign up" : "Have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "center", 
    backgroundColor: "#0a0a0a" 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center",
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
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16,
    backgroundColor: "#1c1c1e",
    color: "#ffffff",
    fontSize: 16
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
  switchText: { 
    textAlign: "center", 
    marginTop: 20, 
    color: "#007AFF" 
  }
});
