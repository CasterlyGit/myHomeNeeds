import { StyleSheet } from 'react-native';
import { Colors } from '../../constants';

export const styles = StyleSheet.create({
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
  scrollContent: {
    paddingBottom: 20,
  },
  cookCard: {
    backgroundColor: Colors.background.secondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  cookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cookNameContainer: {
    flex: 1,
  },
  cookName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  kitchenName: {
    fontSize: 14,
    color: Colors.text.accent,
    fontStyle: "italic",
  },
  openBadge: {
    backgroundColor: Colors.status.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  openText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600"
  },
  cookServices: { 
    fontSize: 16, 
    color: Colors.text.accent, 
    marginBottom: 8,
    fontWeight: "500"
  },
  cookAbout: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cookFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealCount: {
    fontSize: 14,
    color: Colors.text.accent,
    fontWeight: "600",
  },
  viewMenuText: { 
    fontSize: 14, 
    color: Colors.text.accent, 
    fontWeight: "600" 
  },
  emptyText: { 
    fontSize: 18, 
    color: Colors.text.secondary, 
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtext: { 
    fontSize: 14, 
    color: Colors.text.secondary,
    textAlign: "center",
  },
  loadingText: { 
    marginTop: 10, 
    color: Colors.text.secondary,
    textAlign: "center"
  }
});