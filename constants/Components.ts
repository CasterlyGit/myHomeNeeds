import { StyleSheet } from 'react-native';
import { Colors } from './Colors';
import { Spacing } from './Layout';
import { Typography } from './Typography';

export const Components = StyleSheet.create({
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.accent,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  userName: {
    ...Typography.body,
    fontWeight: '600',
  },

  // Task Card styles
  taskCard: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    marginBottom: Spacing.md,
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  taskCardIcon: {
    backgroundColor: '#1f1f1f',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  taskCardComingSoon: {
    backgroundColor: Colors.status.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  taskCardFooter: {
    alignItems: 'flex-end',
  },

  // Button styles
  buttonPrimary: {
    backgroundColor: Colors.button.primary,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: Colors.button.secondary,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.accent,
  },
  buttonAction: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },

  // Form styles
  input: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    padding: Spacing.lg,
    borderRadius: 8,
    color: Colors.text.primary,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    padding: Spacing.lg,
    borderRadius: 8,
    color: Colors.text.primary,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },

  // Status badges
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },

  // Empty states
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xxl,
  },
});