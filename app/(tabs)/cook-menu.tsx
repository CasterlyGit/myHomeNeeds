import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";

export default function CookMenu() {
  const { id } = useLocalSearchParams();
  const [cook, setCook] = useState(null);
  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchCookAndMeals();
  }, [id]);

  const fetchCookAndMeals = async () => {
    try {
      const cooksSnapshot = await getDocs(collection(db, "taskers"));
      const cookData = cooksSnapshot.docs.find(doc => doc.id === id);
      if (cookData) {
        setCook({ id: cookData.id, ...cookData.data() });
      }

      const mealsQuery = query(collection(db, "meals"), where("cookId", "==", cookData.data().userId));
      const mealsSnapshot = await getDocs(mealsQuery);
      const mealsData = [];
      mealsSnapshot.forEach((doc) => {
        mealsData.push({ id: doc.id, ...doc.data() });
      });
      setMeals(mealsData);
    } catch (error) {
      alert("Error loading menu");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (meal) => {
    setCart(prevCart => ({
      ...prevCart,
      [meal.id]: {
        ...meal,
        quantity: (prevCart[meal.id]?.quantity || 0) + 1
      }
    }));
  };

  const removeFromCart = (mealId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[mealId].quantity > 1) {
        newCart[mealId].quantity -= 1;
      } else {
        delete newCart[mealId];
      }
      return newCart;
    });
  };

  const updateCartQuantity = (mealId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(mealId);
      return;
    }
    
    setCart(prevCart => ({
      ...prevCart,
      [mealId]: {
        ...prevCart[mealId],
        quantity: newQuantity
      }
    }));
  };

  const getCartTotal = () => {
    return Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = async () => {
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const orderId = Date.now().toString();
      await setDoc(doc(db, "orders", orderId), {
        cookId: cook.userId,
        cookName: cook.name,
        items: cart,
        total: getCartTotal(),
        status: "pending",
        createdAt: new Date(),
        customerName: "Customer", // In real app, get from user profile
        customerPhone: "123-456-7890" // In real app, get from user profile
      });
      
      alert(`Order placed successfully! Total: $${getCartTotal().toFixed(2)}`);
      setCart({});
      setShowCart(false);
    } catch (error) {
      alert("Error placing order");
    }
  };

  const contactCook = () => {
    if (cook?.phone) {
      Linking.openURL(`tel:${cook.phone}`);
    } else {
      alert("Contact information not available");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/meals-browse")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      {cook && (
        <>
          <Text style={styles.title}>{cook.name}'s Kitchen</Text>
          <Text style={styles.cookAbout}>{cook.about}</Text>
          <Text style={styles.cookServices}>Specialties: {cook.services}</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.contactButton} onPress={contactCook}>
              <Text style={styles.contactButtonText}>📞 Contact</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.cartButton, getCartItemCount() > 0 && styles.cartButtonActive]}
              onPress={() => setShowCart(!showCart)}
            >
              <Text style={styles.cartButtonText}>
                {showCart ? "📋 Menu" : `🛒 Cart (${getCartItemCount()})`}
              </Text>
            </TouchableOpacity>
          </View>

          {showCart ? (
            <View style={styles.cartSection}>
              <Text style={styles.cartTitle}>Your Order</Text>
              {Object.keys(cart).length === 0 ? (
                <View style={styles.emptyCartContainer}>
                  <Text style={styles.emptyCart}>Your cart is empty</Text>
                  <TouchableOpacity 
                    style={styles.backToMenuButton}
                    onPress={() => setShowCart(false)}
                  >
                    <Text style={styles.backToMenuText}>Browse Menu</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <ScrollView style={styles.cartItems}>
                    {Object.values(cart).map((item) => (
                      <View key={item.id} style={styles.cartItem}>
                        <View style={styles.cartItemInfo}>
                          <Text style={styles.cartItemName}>{item.mealName}</Text>
                          <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity 
                            style={styles.quantityButton}
                            onPress={() => removeFromCart(item.id)}
                          >
                            <Text style={styles.quantityText}>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.quantity}>{item.quantity}</Text>
                          <TouchableOpacity 
                            style={styles.quantityButton}
                            onPress={() => addToCart(item)}
                          >
                            <Text style={styles.quantityText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                  <View style={styles.cartTotal}>
                    <Text style={styles.totalText}>Total: ${getCartTotal().toFixed(2)}</Text>
                    <TouchableOpacity style={styles.orderButton} onPress={placeOrder}>
                      <Text style={styles.orderButtonText}>Place Order</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ) : (
            <>
              <Text style={styles.menuTitle}>Menu</Text>
              
              {meals.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No meals listed yet</Text>
                </View>
              ) : (
                <ScrollView style={styles.mealsList}>
                  {meals.map((meal) => {
                    const cartQuantity = cart[meal.id]?.quantity || 0;
                    return (
                      <View key={meal.id} style={styles.mealCard}>
                        <View style={styles.mealHeader}>
                          <Text style={styles.mealName}>{meal.mealName}</Text>
                          <View style={styles.priceBox}>
                            <Text style={styles.mealPrice}>${meal.price}</Text>
                          </View>
                        </View>
                        <Text style={styles.mealCuisine}>{meal.cuisine}</Text>
                        <Text style={styles.mealDescription}>{meal.description}</Text>
                        
                        {cartQuantity > 0 ? (
                          <View style={styles.quantityRow}>
                            <TouchableOpacity 
                              style={styles.quantityButtonSmall}
                              onPress={() => removeFromCart(meal.id)}
                            >
                              <Text style={styles.quantityTextSmall}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityDisplay}>{cartQuantity}</Text>
                            <TouchableOpacity 
                              style={styles.quantityButtonSmall}
                              onPress={() => addToCart(meal)}
                            >
                              <Text style={styles.quantityTextSmall}>+</Text>
                            </TouchableOpacity>
                            <Text style={styles.inCartText}>in cart</Text>
                          </View>
                        ) : (
                          <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => addToCart(meal)}
                          >
                            <Text style={styles.addButtonText}>+ Add to Cart</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0a0a0a" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, marginTop: 50, color: "#ffffff" },
  cookAbout: { fontSize: 16, color: "#888", marginBottom: 10 },
  cookServices: { fontSize: 14, color: "#666", marginBottom: 20 },
  menuTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15, marginTop: 20, color: "#ffffff" },
  backButton: { position: "absolute", top: 50, left: 20 },
  backButtonText: { color: "#007AFF", fontSize: 16 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  contactButton: { backgroundColor: "#34C759", padding: 12, borderRadius: 8, flex: 1, marginRight: 10, alignItems: "center" },
  contactButtonText: { color: "white", fontSize: 14, fontWeight: "600" },
  cartButton: { backgroundColor: "#1c1c1e", padding: 12, borderRadius: 8, flex: 1, marginLeft: 10, alignItems: "center", borderWidth: 1, borderColor: "#2c2c2e" },
  cartButtonActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  cartButtonText: { color: "white", fontSize: 14, fontWeight: "600" },
  mealsList: { flex: 1 },
  mealCard: { 
    backgroundColor: "#1c1c1e", 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2c2c2e"
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8
  },
  mealName: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#ffffff",
    flex: 1,
    marginRight: 12
  },
  priceBox: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 70
  },
  mealPrice: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "white",
    textAlign: "center"
  },
  mealCuisine: { 
    fontSize: 16, 
    color: "#aaa", 
    marginBottom: 8,
    fontWeight: "500"
  },
  mealDescription: { 
    fontSize: 15, 
    color: "#ccc",
    lineHeight: 20,
    marginBottom: 12
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  quantityButtonSmall: {
    backgroundColor: "#007AFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  quantityTextSmall: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  quantityDisplay: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center"
  },
  inCartText: {
    color: "#34C759",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8
  },
  addButton: {
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600"
  },
  cartSection: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2c2c2e"
  },
  cartTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
    textAlign: "center"
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyCart: {
    color: "#888",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20
  },
  backToMenuButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },
  backToMenuText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600"
  },
  cartItems: {
    flex: 1
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2e"
  },
  cartItemInfo: {
    flex: 1
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4
  },
  cartItemPrice: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600"
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center"
  },
  quantityButton: {
    backgroundColor: "#007AFF",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  quantityText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  quantity: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center"
  },
  cartTotal: {
    borderTopWidth: 1,
    borderTopColor: "#2c2c2e",
    paddingTop: 15,
    marginTop: 15
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 15
  },
  orderButton: {
    backgroundColor: "#34C759",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  orderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },
  emptyState: { alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#666" },
  loadingText: { marginTop: 10, color: "#666", textAlign: "center" }
});
