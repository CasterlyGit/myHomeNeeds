import { StyleSheet } from 'react-native';

export const Colors = {
  background: '#0a0a0a',
  card: '#1c1c1e',
  border: '#2c2c2e',
  text: {
    primary: '#ffffff',
    secondary: '#888',
    accent: '#007AFF',
  },
  status: {
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  }
};

export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
  },
  body: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  }
};

export const Layout = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    primary: {
      backgroundColor: Colors.text.accent,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center' as const,
    },
    secondary: {
      backgroundColor: 'transparent',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center' as const,
      borderWidth: 1,
      borderColor: Colors.text.accent,
    }
  }
};

// Reusable component styles
export const ComponentStyles = {
  header: StyleSheet.create({
    container: {
      flexDirection: 'row' as const,
      justifyContent: 'flex-end' as const,
      alignItems: 'center' as const,
      marginBottom: 20,
      marginTop: 10,
    },
    loginButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.text.accent,
    },
    userInfo: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8,
    },
    userName: {
      color: Colors.text.primary,
      fontSize: 16,
      fontWeight: '600' as const,
    }
  }),

  taskCard: StyleSheet.create({
    container: {
      backgroundColor: Colors.card,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    comingSoon: {
      opacity: 0.6,
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 12,
    },
    iconContainer: {
      backgroundColor: '#1f1f1f',
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    comingSoonBadge: {
      backgroundColor: Colors.status.warning,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: Colors.text.primary,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: Colors.text.secondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    footer: {
      alignItems: 'flex-end' as const,
    }
  }),

  actionButton: StyleSheet.create({
    container: {
      flex: 1,
      minWidth: '48%',
      backgroundColor: Colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center' as const,
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      gap: 8,
    },
    text: {
      color: Colors.text.accent,
      fontSize: 14,
      fontWeight: '600' as const,
    }
  }),

  authButton: StyleSheet.create({
    primary: {
      backgroundColor: Colors.text.accent,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center' as const,
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      gap: 8,
    },
    secondary: {
      backgroundColor: 'transparent',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center' as const,
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      gap: 8,
      borderWidth: 1,
      borderColor: Colors.text.accent,
    },
    text: {
      primary: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600' as const,
      },
      secondary: {
        color: Colors.text.accent,
        fontSize: 16,
        fontWeight: '600' as const,
      }
    }
  })
};

// Common text styles
export const TextStyles = {
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    textAlign: 'center' as const,
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center' as const,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  comingSoonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600' as const,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.text.secondary,
    textAlign: 'center' as const,
  }
};