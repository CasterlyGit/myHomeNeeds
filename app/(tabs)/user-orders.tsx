import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { db, auth } from "../../firebase/config";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Real-time listener for user's orders
    const ordersQuery = query(
      collection(db, "orders"), 
      where("customerName", "==", "Customer"), // In real app, use actual user ID
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'accepted': return '#007AFF';
      case 'completed': return '#34C759';
      case 'declined': return '#FF3B30';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '🟡 Waiting for cook to accept';
      case 'accepted': return '🔵 Cook is preparing your order';
      case 'completed': return '🟢 Order completed!';
      case 'declined': return '🔴 Order declined by cook';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>My Orders</Text>
      <Text style={styles.subtitle}>Track your food orders</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Your orders will appear here</Text>
        </View>
      ) : (
        <ScrollView style={styles.ordersList}>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{order.id.slice(-6)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
              
              <Text style={styles.cookInfo}>From: {order.cookName}</Text>
              <Text style={styles.statusDescription}>{getStatusText(order.status)}</Text>
              
              <View style={styles.orderItems}>
                {Object.values(order.items).map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <Text style={styles.itemName}>{item.quantity}x {item.mealName}</Text>
                    <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.orderTotal}>
                <Text style={styles.totalText}>Total: ${order.total?.toFixed(2)}</Text>
              </View>
              
              <Text style={styles.orderTime}>
                Ordered: {order.createdAt?.toDate().toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
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
    marginTop: 50,
    color: "#ffffff"
  },
  subtitle: { 
    fontSize: 16, 
    color: "#888", 
    marginBottom: 30 
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
  ordersList: { 
    flex: 1 
  },
  orderCard: { 
    backgroundColor: "#1c1c1e", 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2c2c2e"
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff"
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600"
  },
  cookInfo: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8
  },
  statusDescription: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 15,
    fontStyle: 'italic'
  },
  orderItems: {
    marginBottom: 15
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2e"
  },
  itemName: {
    fontSize: 14,
    color: "#ffffff",
    flex: 1
  },
  itemPrice: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600"
  },
  orderTotal: {
    borderTopWidth: 1,
    borderTopColor: "#2c2c2e",
    paddingTop: 12,
    marginBottom: 12
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center"
  },
  orderTime: {
    fontSize: 12,
    color: "#666",
    textAlign: "center"
  },
  emptyState: { 
    alignItems: "center", 
    padding: 40 
  },
  emptyText: { 
    fontSize: 18, 
    color: "#666", 
    marginBottom: 5 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: "#999" 
  }
});
