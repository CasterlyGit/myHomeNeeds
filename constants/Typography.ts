import { Colors } from './Colors';

export const Typography = {
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    textAlign: 'center' as const,
  },
  title2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center' as const,
  },
  body: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  body2: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  buttonSecondary: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.accent,
  }
};