import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const Layout = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.background.secondary,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  section: {
    marginBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 30,
  xxl: 40,
};