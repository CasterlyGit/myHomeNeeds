import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Components, Layout, Typography } from "../../constants";
import { auth, db } from "../../firebase/config";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Only fetch orders if user is logged in
        const ordersQuery = query(
          collection(db, "orders"),
          where("customerId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        
        const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
          const ordersData = [];
          snapshot.forEach((doc) => {
            ordersData.push({ id: doc.id, ...doc.data() });
          });
          setOrders(ordersData);
          setLoading(false);
        });

        return unsubscribeOrders;
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return unsubscribeAuth;
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return Colors.status.warning;
      case 'accepted': return Colors.status.info;
      case 'completed': return Colors.status.success;
      case 'declined': return Colors.status.error;
      default: return Colors.text.secondary;
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

  if (!user) {
    return (
      <View style={Layout.container}>
        <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={Typography.title2}>My Orders</Text>
        <View style={Components.emptyState}>
          <Text style={styles.emptyText}>Please login to view your orders</Text>
          <TouchableOpacity 
            style={Components.buttonPrimary}
            onPress={() => router.push('/login')}
          >
            <Text style={Typography.button}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={Layout.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={Typography.title2}>My Orders</Text>
      <Text style={Typography.subtitle}>Track your food orders</Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.text.accent} />
      ) : orders.length === 0 ? (
        <View style={Components.emptyState}>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Your orders will appear here</Text>
        </View>
      ) : (
        <ScrollView style={Layout.scrollView}>
          {orders.map((order) => (
            <View key={order.id} style={Components.card}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{order.id.slice(-6)}</Text>
                <View style={[Components.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
              
              <Text style={styles.cookInfo}>From: {order.cookName}</Text>
              <Text style={styles.statusDescription}>{getStatusText(order.status)}</Text>
              
              <View style={styles.orderItems}>
                {Object.values(order.items || {}).map((item, index) => (
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
  backButton: { 
    position: "absolute", 
    top: 50, 
    left: 20,
    zIndex: 1
  },
  backButtonText: { 
    color: Colors.text.accent, 
    fontSize: 16 
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
    color: Colors.text.primary
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600"
  },
  cookInfo: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8
  },
  statusDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
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
    borderBottomColor: Colors.border.primary
  },
  itemName: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.text.accent,
    fontWeight: "600"
  },
  orderTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    paddingTop: 12,
    marginBottom: 12
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text.primary,
    textAlign: "center"
  },
  orderTime: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: "center"
  },
  emptyText: { 
    fontSize: 18, 
    color: Colors.text.secondary, 
    marginBottom: 10 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: Colors.text.secondary 
  }
});