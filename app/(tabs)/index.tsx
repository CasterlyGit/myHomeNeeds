import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Components, Layout, Typography } from '../../constants';
import { auth } from '../../firebase/config';
import { useUserRole } from '../../hooks/useUserRole';

// Reusable Task Card Component
const TaskCard = ({ 
  title, 
  description, 
  icon, 
  onPress, 
  comingSoon = false 
}: { 
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  comingSoon?: boolean;
}) => {
  return (
    <TouchableOpacity 
      style={[
        Components.taskCard,
        comingSoon && { opacity: 0.6 }
      ]}
      onPress={onPress}
      disabled={comingSoon}
    >
      <View style={Components.taskCardHeader}>
        <View style={Components.taskCardIcon}>
          <Ionicons name={icon} size={24} color={Colors.text.accent} />
        </View>
        {comingSoon && (
          <View style={Components.taskCardComingSoon}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
      </View>
      
      <Text style={Typography.header}>{title}</Text>
      <Text style={Typography.body2}>{description}</Text>
      
      <View style={Components.taskCardFooter}>
        <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const { role, loading } = useUserRole();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return unsubscribe; // Cleanup on unmount
  }, []);

  if (loading) {
    return (
      <View style={Layout.centered}>
        <Text style={Typography.subtitle}>Loading...</Text>
      </View>
    );
  }

  const taskCards = [
    {
      id: 1,
      title: "Home Cooked Food",
      description: "Order delicious homemade meals from local cooks",
      icon: "restaurant" as keyof typeof Ionicons.glyphMap,
      onPress: () => router.push('/meals-browse'),
      comingSoon: false
    },
    {
      id: 2,
      title: "Pet Sitter",
      description: "Find trusted pet sitters in your neighborhood",
      icon: "paw" as keyof typeof Ionicons.glyphMap,
      onPress: () => {},
      comingSoon: true
    },
    {
      id: 3,
      title: "Cleaner",
      description: "Book professional cleaning services",
      icon: "sparkles" as keyof typeof Ionicons.glyphMap,
      onPress: () => {},
      comingSoon: true
    }
  ];

  return (
    <View style={Layout.container}>
      {/* Header with Login/User Info */}
      <View style={Components.header}>
        {user ? (
          <View style={Components.userInfo}>
            <Ionicons name="person-circle" size={24} color={Colors.text.accent} />
            <Text style={Components.userName}>
              {user.displayName || user.email?.split('@')[0] || 'User'}
            </Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={Components.loginButton}
            onPress={() => router.push('/login')}
          >
            <Ionicons name="log-in" size={20} color={Colors.text.accent} />
            <Text style={Typography.buttonSecondary}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={Layout.scrollView}>
        <Text style={Typography.title}>myHomeNeeds</Text>
        <Text style={Typography.subtitle}>
          Your home services marketplace
        </Text>

        {/* Task Cards Grid */}
        <View style={styles.cardsContainer}>
          {taskCards.map((card) => (
            <TaskCard
              key={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              onPress={card.onPress}
              comingSoon={card.comingSoon}
            />
          ))}
        </View>

        {/* Quick Actions for Logged-in Users */}
        {user && (
          <View style={Layout.section}>
            <Text style={Typography.header}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              {role === 'cook' ? (
                <>
                  <TouchableOpacity 
                    style={Components.buttonAction}
                    onPress={() => router.push('/tasker-dashboard')}
                  >
                    <Ionicons name="grid" size={20} color={Colors.text.accent} />
                    <Text style={Typography.buttonSecondary}>Dashboard</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={Components.buttonAction}
                    onPress={() => router.push('/cook-menu')}
                  >
                    <Ionicons name="fast-food" size={20} color={Colors.text.accent} />
                    <Text style={Typography.buttonSecondary}>My Menu</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={Components.buttonAction}
                    onPress={() => router.push('/user-orders')}
                  >
                    <Ionicons name="receipt" size={20} color={Colors.text.accent} />
                    <Text style={Typography.buttonSecondary}>Orders</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity 
                    style={Components.buttonAction}
                    onPress={() => router.push('/user-orders')}
                  >
                    <Ionicons name="receipt" size={20} color={Colors.text.accent} />
                    <Text style={Typography.buttonSecondary}>My Orders</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={Components.buttonAction}
                    onPress={() => router.push('/meals-browse')}
                  >
                    <Ionicons name="search" size={20} color={Colors.text.accent} />
                    <Text style={Typography.buttonSecondary}>Browse Food</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}

        {/* Become a Cook Button for Non-Logged-in Users */}
        {!user && (
          <View style={styles.authSection}>
            <TouchableOpacity 
              style={Components.buttonSecondary}
              onPress={() => router.push('/tasker-register')}
            >
              <Ionicons name="restaurant" size={20} color={Colors.text.accent} />
              <Text style={Typography.buttonSecondary}>Become a Cook</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Local styles specific to this component
const styles = StyleSheet.create({
  cardsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  authSection: {
    gap: 12,
    marginTop: 20,
  },
  comingSoonText: {
    color: Colors.text.inverse,
    fontSize: 10,
    fontWeight: '600',
  },
});