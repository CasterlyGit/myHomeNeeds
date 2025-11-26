import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomDock from "./BottomDock";

export default function ServicesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
      </View>
      
      <Text style={styles.subtitle}>Choose what you need help with</Text>
      
      <ScrollView 
        style={styles.cardsContainer}
        contentContainerStyle={styles.cardsContentContainer}
      >
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push("/meals-browse")}
        >
          <Text style={styles.cardIcon}>🍛</Text>
          <Text style={styles.cardTitle}>Home Cooked Meals</Text>
          <Text style={styles.cardDescription}>Fresh meals from local cooks</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push("/user-orders")}
        >
          <Text style={styles.cardIcon}>📦</Text>
          <Text style={styles.cardTitle}>My Orders</Text>
          <Text style={styles.cardDescription}>Track your food orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>🐕</Text>
          <Text style={styles.cardTitle}>Pet Sitting</Text>
          <Text style={styles.cardDescription}>Trusted pet care</Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>🧹</Text>
          <Text style={styles.cardTitle}>Cleaning Service</Text>
          <Text style={styles.cardDescription}>Spotless cleaning</Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>📋</Text>
          <Text style={styles.cardTitle}>Other Tasks</Text>
          <Text style={styles.cardDescription}>Any odd job you need</Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <BottomDock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#0a0a0a" 
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 10,
    marginTop: 20
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#ffffff" 
  },
  subtitle: { 
    fontSize: 16, 
    color: "#888", 
    marginBottom: 30 
  },
  cardsContainer: {
    flex: 1,
  },
  cardsContentContainer: {
    paddingBottom: 120 // Extra padding for dock
  },
  card: { 
    backgroundColor: "#1c1c1e", 
    padding: 25, 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2c2c2e"
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12
  },
  cardTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 8,
    color: "#ffffff" 
  },
  cardDescription: { 
    fontSize: 14, 
    color: "#aaa",
    lineHeight: 20
  },
  comingSoonBadge: {
    marginTop: 10,
    backgroundColor: "rgba(255, 149, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 149, 0, 0.4)"
  },
  comingSoonText: {
    color: "#FF9500",
    fontSize: 12,
    fontWeight: "600"
  }
});