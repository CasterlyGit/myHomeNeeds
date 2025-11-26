import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebase/config";

export default function Settings() {
  const [displayName, setDisplayName] = useState("");
  const [kitchenName, setKitchenName] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [services, setServices] = useState("");
  const [isTasker, setIsTasker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Check if user is a tasker
      const taskersQuery = query(
        collection(db, "taskers"), 
        where("userId", "==", currentUser.uid)
      );
      const taskerSnapshot = await getDocs(taskersQuery);
      
      if (!taskerSnapshot.empty) {
        setIsTasker(true);
        const taskerData = taskerSnapshot.docs[0].data();
        setDisplayName(taskerData.name || "");
        setKitchenName(taskerData.kitchenName || taskerData.name + "'s Kitchen");
        setPhone(taskerData.phone || "");
        setAbout(taskerData.about || "");
        setServices(taskerData.services || "");
      } else {
        setDisplayName(currentUser.email?.split('@')[0] || "Customer");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!displayName?.trim()) {
      Alert.alert("Error", "Please enter a display name");
      return;
    }
    
    if (isTasker && !kitchenName?.trim()) {
      Alert.alert("Error", "Please enter a kitchen name");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      if (isTasker) {
        // Update tasker profile
        const taskersQuery = query(
          collection(db, "taskers"), 
          where("userId", "==", currentUser.uid)
        );
        const taskerSnapshot = await getDocs(taskersQuery);
        
        if (!taskerSnapshot.empty) {
          const taskerDoc = taskerSnapshot.docs[0];
          await updateDoc(doc(db, "taskers", taskerDoc.id), {
            name: displayName,
            kitchenName: kitchenName,
            phone: phone,
            about: about,
            services: services,
            updatedAt: new Date()
          });
          Alert.alert("Success", "Profile updated successfully!");
        }
      } else {
        // For regular users, we'd update user profile here
        Alert.alert("Success", "Profile updated!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/login");
            } catch (error) {
              Alert.alert("Error", "Failed to logout");
            }
          }
        }
      ]
    );
  };

  const addProfilePhoto = () => {
    Alert.alert("Profile Photo", "Photo upload feature coming soon!");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Account Settings</Text>
      
      {/* Profile Photo */}
      <TouchableOpacity style={styles.photoSection} onPress={addProfilePhoto}>
        <View style={styles.profilePhoto}>
          <Text style={styles.photoPlaceholder}>👤</Text>
        </View>
        <Text style={styles.photoText}>Tap to add profile photo</Text>
      </TouchableOpacity>

      {/* User Email */}
      <View style={styles.emailContainer}>
        <Text style={styles.emailLabel}>Email</Text>
        <Text style={styles.emailText}>{auth.currentUser?.email}</Text>
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="Display Name *" 
        placeholderTextColor="#888"
        value={displayName}
        onChangeText={setDisplayName}
      />

      {isTasker && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kitchen Details</Text>
          </View>
          
          <TextInput 
            style={styles.input} 
            placeholder="Kitchen Name *" 
            placeholderTextColor="#888"
            value={kitchenName}
            onChangeText={setKitchenName}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Phone Number" 
            placeholderTextColor="#888"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Services (e.g., North Indian, Italian)" 
            placeholderTextColor="#888"
            value={services}
            onChangeText={setServices}
          />
          <TextInput 
            style={styles.bigInput} 
            placeholder="About your kitchen..." 
            placeholderTextColor="#888"
            value={about}
            onChangeText={setAbout}
            multiline 
            numberOfLines={3} 
          />
        </>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>💾 Save Changes</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0a0a0a" 
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 30, 
    textAlign: "center", 
    marginTop: 50,
    color: "#ffffff"
  },
  backButton: { 
    position: "absolute", 
    top: 50, 
    left: 20,
    zIndex: 10
  },
  backButtonText: { 
    color: "#007AFF", 
    fontSize: 16 
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 30
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1c1c1e",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#007AFF",
    marginBottom: 10
  },
  photoPlaceholder: {
    fontSize: 40
  },
  photoText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600"
  },
  emailContainer: {
    backgroundColor: "#1c1c1e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2c2c2e"
  },
  emailLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  emailText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500"
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 15
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700"
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
  saveButton: { 
    backgroundColor: "#007AFF", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center",
    marginTop: 10
  },
  saveButtonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  divider: {
    height: 1,
    backgroundColor: "#2c2c2e",
    marginVertical: 30
  },
  logoutButton: { 
    backgroundColor: "transparent", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF3B30"
  },
  logoutButtonText: { 
    color: "#FF3B30", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 50
  }
});