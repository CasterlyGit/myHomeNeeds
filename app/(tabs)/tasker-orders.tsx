import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, query, where, doc, updateDoc, onSnapshot } from "firebase/firestore";

export default function TaskerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(
        collection(db, "orders"), 
        where("cookId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
      setLoading(false);
    } catch (error) {
      alert("Error loading orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Real-time listener for new orders
    const ordersQuery = query(
      collection(db, "orders"), 
      where("cookId", "==", auth.currentUser?.uid)
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update order");
    }
  };

  const getOrderTotal = (order) => {
    return order.total || Object.values(order.items).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/tasker-dashboard")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>New Orders</Text>
      <Text style={styles.subtitle}>Manage incoming food orders</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Orders will appear here when customers place them</Text>
        </View>
      ) : (
        <ScrollView style={styles.ordersList}>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{order.id.slice(-6)}</Text>
                <View style={[styles.statusBadge, 
                  order.status === 'pending' && styles.statusPending,
                  order.status === 'accepted' && styles.statusAccepted,
                  order.status === 'completed' && styles.statusCompleted
                ]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
              
              <Text style={styles.customerInfo}>Customer: {order.customerName}</Text>
              
              <View style={styles.orderItems}>
                {Object.values(order.items).map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <Text style={styles.itemName}>{item.quantity}x {item.mealName}</Text>
                    <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.orderTotal}>
                <Text style={styles.totalText}>Total: ${getOrderTotal(order).toFixed(2)}</Text>
              </View>
              
              {order.status === 'pending' && (
                <View style={styles.orderActions}>
                  <TouchableOpacity 
                    style={styles.acceptButton}
                    onPress={() => updateOrderStatus(order.id, 'accepted')}
                  >
                    <Text style={styles.acceptButtonText}>Accept Order</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.declineButton}
                    onPress={() => updateOrderStatus(order.id, 'declined')}
                  >
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {order.status === 'accepted' && (
                <TouchableOpacity 
                  style={styles.completeButton}
                  onPress={() => updateOrderStatus(order.id, 'completed')}
                >
                  <Text style={styles.completeButtonText}>Mark as Completed</Text>
                </TouchableOpacity>
              )}
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
  statusPending: {
    backgroundColor: "#FF9500"
  },
  statusAccepted: {
    backgroundColor: "#007AFF"
  },
  statusCompleted: {
    backgroundColor: "#34C759"
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600"
  },
  customerInfo: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 15
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
    marginBottom: 15
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center"
  },
  orderActions: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  acceptButton: {
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center"
  },
  acceptButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600"
  },
  declineButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center"
  },
  declineButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600"
  },
  completeButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },
  completeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600"
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
