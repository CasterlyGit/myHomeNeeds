import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { auth, db } from "../../firebase/config";

export default function BottomDock() {
  const checkTaskerProfile = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "taskers"));
      const userTaskerProfile = querySnapshot.docs.find(
        doc => doc.data().userId === auth.currentUser?.uid
      );
      
      if (userTaskerProfile) {
        router.push("/tasker-services");
      } else {
        router.push("/tasker-register");
      }
    } catch (error) {
      alert("Error checking profile");
    }
  };

  return (
    <View style={styles.dockContainer}>
      <View style={styles.dock}>
        {/* Tasker Icon */}
        <TouchableOpacity 
          style={styles.dockButton}
          onPress={checkTaskerProfile}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>👨‍🍳</Text>
          </View>
          <Text style={styles.labelText}>Tasker</Text>
        </TouchableOpacity>

        {/* Settings Icon */}
        <TouchableOpacity 
          style={styles.dockButton}
          onPress={() => router.push("/settings")}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>⚙️</Text>
          </View>
          <Text style={styles.labelText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 1000
  },
  dock: {
    flexDirection: "row",
    backgroundColor: "rgba(28, 28, 30, 0.95)",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 30,
    gap: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    backdropFilter: "blur(20px)"
  },
  dockButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(0, 122, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.3)"
  },
  iconText: {
    fontSize: 26
  },
  labelText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2
  }
});