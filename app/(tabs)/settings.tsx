import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Components, Layout, Typography } from '../../constants';
import { auth } from '../../firebase/config';

export default function Settings() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Coming Soon', 'Account deletion feature will be added soon');
        }},
      ]
    );
  };

  return (
    <View style={Layout.container}>
      <Text style={Typography.title2}>Settings</Text>

      {user && (
        <View style={[Components.card, styles.userCard]}>
          <Ionicons name="person-circle" size={48} color={Colors.text.accent} />
          <View style={styles.userInfo}>
            <Text style={Typography.header}>
              {user.displayName || 'User'}
            </Text>
            <Text style={Typography.body2}>{user.email}</Text>
            <Text style={Typography.caption}>
              User since {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
            </Text>
          </View>
        </View>
      )}

      <View style={Layout.section}>
        <Text style={Typography.header}>Account</Text>
        
        {user ? (
          <>
            <TouchableOpacity style={Components.buttonAction} onPress={() => router.push('/tasker-profile')}>
              <Ionicons name="person" size={20} color={Colors.text.accent} />
              <Text style={Typography.buttonSecondary}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={Components.buttonAction} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color={Colors.status.error} />
              <Text style={[Typography.buttonSecondary, { color: Colors.status.error }]}>Log Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={Components.buttonAction} onPress={() => router.push('/login')}>
            <Ionicons name="log-in" size={20} color={Colors.text.accent} />
            <Text style={Typography.buttonSecondary}>Login to Your Account</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={Layout.section}>
        <Text style={Typography.header}>App</Text>
        
        <TouchableOpacity style={Components.buttonAction} onPress={() => Alert.alert('Coming Soon', 'Notifications settings will be added soon')}>
          <Ionicons name="notifications" size={20} color={Colors.text.accent} />
          <Text style={Typography.buttonSecondary}>Notifications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={Components.buttonAction} onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be added soon')}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.text.accent} />
          <Text style={Typography.buttonSecondary}>Privacy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={Components.buttonAction} onPress={() => Alert.alert('Coming Soon', 'Help & support will be added soon')}>
          <Ionicons name="help-circle" size={20} color={Colors.text.accent} />
          <Text style={Typography.buttonSecondary}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      {user && (
        <View style={Layout.section}>
          <Text style={Typography.header}>Danger Zone</Text>
          
          <TouchableOpacity style={[Components.buttonAction, styles.dangerButton]} onPress={handleDeleteAccount}>
            <Ionicons name="trash" size={20} color={Colors.status.error} />
            <Text style={[Typography.buttonSecondary, { color: Colors.status.error }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={Typography.caption}>myHomeNeeds v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 40,
  },
  userInfo: {
    flex: 1,
  },
  dangerButton: {
    borderColor: Colors.status.error,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
});