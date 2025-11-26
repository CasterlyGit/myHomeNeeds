// FILE: hooks/useUserRole.ts

import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';

export type UserRole = 'user' | 'cook' | null;

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async (user: User | null) => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // Check if user is a cook by looking in taskers collection
        const cookDoc = await getDoc(doc(db, 'taskers', user.uid));
        if (cookDoc.exists()) {
          setRole('cook');
        } else {
          setRole('user');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(checkUserRole);

    return unsubscribe;
  }, []);

  return { role, loading };
}