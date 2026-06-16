import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  useColorScheme,
  ScrollView
} from 'react-native';
import { Colors } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { ChefHat, CheckCircle2, Clock, PackageCheck } from 'lucide-react-native';

// Explicitly define what data shapes constitute a multi-order structure
interface OrderItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface OrderStructure {
  id: string;
  currentOrderStatus: 'received' | 'preparing' | 'ready' | 'completed' | 'none';
  activeOrderItems: OrderItem[];
}

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'dark'];
  
  // Destructure activeOrders array along with your collection clearance callback
  const { activeOrders = [], clearActiveOrder } = useCart();

  // Helper utility to calculate progress styling checkpoints dynamically
  const getStepStatus = (status: string, step: 'received' | 'preparing' | 'ready') => {
    const statusWeights = { none: 0, received: 1, preparing: 2, ready: 3, completed: 4 };
    const currentWeight = statusWeights[status as keyof typeof statusWeights] || 0;
    const stepWeight = statusWeights[step];

    if (currentWeight > stepWeight) return 'completed';
    if (currentWeight === stepWeight) return 'active';
    return 'pending';
  };

  // Safe fallback view if there are genuinely zero active order tickets on file
  if (!activeOrders || activeOrders.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: activeColors.background }]}>
        <Clock size={64} color="#FF7600" strokeWidth={1.5} />
        <Text style={[styles.emptyTitle, { color: activeColors.text }]}>No active orders</Text>
        <Text style={styles.emptySubtitle}>You haven't placed any orders yet. Head over to the Menu to get started!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: activeColors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Track Orders</Text>
        <Text style={styles.orderIdText}>{activeOrders.length} Order Monitor{activeOrders.length > 1 ? 's' : ''} Active</Text>
      </View>

      {/* Map through each active order ticket in your queue */}
      {(activeOrders as OrderStructure[]).map((order: OrderStructure, orderIndex: number) => {
        const { id, currentOrderStatus, activeOrderItems } = order;

        return (
          <View key={id || `order-${orderIndex}`} style={styles.orderGroupContainer}>
            <View style={styles.orderSectionDivider}>
              <Text style={styles.orderSectionTitle}>ORDER ID: #{id || orderIndex + 1}</Text>
            </View>

            {/* TRACKING TIMELINE PANEL CONTAINER */}
            <View style={[styles.cardPanel, { backgroundColor: '#161618', borderColor: '#262629' }]}>
              
              {/* Step 1: Received */}
              <View style={styles.timelineRow}>
                <View style={styles.iconColumn}>
                  <View style={[styles.statusIndicatorCircle, 
                    getStepStatus(currentOrderStatus, 'received') === 'completed' && { backgroundColor: '#FF7600' },
                    getStepStatus(currentOrderStatus, 'received') === 'active' && { backgroundColor: activeColors.primary }
                  ]}>
                    {getStepStatus(currentOrderStatus, 'received') === 'completed' ? <CheckCircle2 size={16} color="#FFF" /> : <Clock size={16} color="#FFF" />}
                  </View>
                  <View style={[styles.verticalConnectorLine, getStepStatus(currentOrderStatus, 'preparing') !== 'pending' && { backgroundColor: '#FF7600' }]} />
                </View>
                <View style={styles.textColumn}>
                  <Text style={[styles.stepTitle, { color: activeColors.text }, getStepStatus(currentOrderStatus, 'received') === 'active' && { color: activeColors.primary }]}>
                    Order Received
                  </Text>
                  <Text style={styles.stepSub}>We have securely processed your order and confirmed your kitchen ticket.</Text>
                </View>
              </View>

              {/* Step 2: Preparing */}
              <View style={styles.timelineRow}>
                <View style={styles.iconColumn}>
                  <View style={[styles.statusIndicatorCircle, 
                    getStepStatus(currentOrderStatus, 'preparing') === 'completed' && { backgroundColor: '#FF7600' },
                    getStepStatus(currentOrderStatus, 'preparing') === 'active' && { backgroundColor: activeColors.primary }
                  ]}>
                    <ChefHat size={16} color="#FFF" />
                  </View>
                  <View style={[styles.verticalConnectorLine, getStepStatus(currentOrderStatus, 'ready') !== 'pending' && { backgroundColor: '#FF7600' }]} />
                </View>
                <View style={styles.textColumn}>
                  <Text style={[styles.stepTitle, { color: activeColors.text }, getStepStatus(currentOrderStatus, 'preparing') === 'active' && { color: activeColors.primary }]}>
                    On the Grill
                  </Text>
                  <Text style={styles.stepSub}>Thabang's kitchen crew is currently preparing your flame-grilled order.</Text>
                </View>
              </View>

              {/* Step 3: Ready */}
              <View style={styles.timelineRow}>
                <View style={styles.iconColumn}>
                  <View style={[styles.statusIndicatorCircle, 
                    getStepStatus(currentOrderStatus, 'ready') === 'completed' || currentOrderStatus.toLowerCase() === 'ready' ? { backgroundColor: '#34C759' } : { backgroundColor: '#262629' }
                  ]}>
                    <PackageCheck size={16} color="#FFF" />
                  </View>
                </View>
                <View style={styles.textColumn}>
                  <Text style={[styles.stepTitle, { color: activeColors.text }, currentOrderStatus.toLowerCase() === 'ready' && { color: '#34C759' }]}>
                    Ready for Collection
                  </Text>
                  <Text style={styles.stepSub}>Your food is hot, packed, and waiting for you at the pick-up counter!</Text>
                </View>
              </View>
            </View>

            {/* SUMMARY ITEMS LIST RECAP */}
            <Text style={[styles.sectionHeading, { color: activeColors.text }]}>Items in this Order</Text>
            <View style={[styles.cardPanel, { backgroundColor: '#161618', borderColor: '#262629' }]}>
              {activeOrderItems?.map((item, index) => (
                <View 
                  key={`${item.id}-${index}`} 
                  style={[
                    styles.itemSummaryRow, 
                    index !== activeOrderItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#262629' }
                  ]}
                >
                  <Text style={[styles.itemQuantity, { color: activeColors.primary }]}>{item.quantity}x</Text>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.itemName, { color: activeColors.text }]}>{item.name}</Text>
                    {item.notes ? <Text style={styles.itemNote}>"📝 {item.notes}"</Text> : null}
                  </View>
                  <Text style={[styles.itemPrice, { color: activeColors.text }]}>R{item.price * item.quantity}</Text>
                </View>
              ))}
            </View>

            {/* ORDER COMPLETE RESET BUTTON */}
            {currentOrderStatus.toLowerCase() === 'ready' && (
              <TouchableOpacity 
                style={[styles.dismissBtn, { backgroundColor: '#34C759' }]}
                onPress={() => clearActiveOrder(id)} // Ensure your clear routine takes an ID parameter to pull the correct ticket out of state
              >
                <Text style={styles.dismissBtnText}>I Have Collected Order #{+ 1}</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900' },
  orderIdText: { fontSize: 13, color: '#FF7600', fontWeight: '700', marginTop: 2 },
  
  orderGroupContainer: { marginBottom: 24 },
  orderSectionDivider: { marginHorizontal: 16, marginTop: 16, borderBottomWidth: 1, borderBottomColor: '#262629', paddingBottom: 6 },
  orderSectionTitle: { fontSize: 12, fontWeight: '900', color: '#8E8E93', letterSpacing: 0.5 },
  
  cardPanel: { marginHorizontal: 16, marginTop: 12, borderRadius: 24, borderWidth: 1, padding: 20 },
  sectionHeading: { fontSize: 14, fontWeight: '800', marginHorizontal: 16, marginTop: 16, marginBottom: 2 },
  
  timelineRow: { flexDirection: 'row', minHeight: 80 },
  iconColumn: { alignItems: 'center', width: 30 },
  statusIndicatorCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#262629', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  verticalConnectorLine: { width: 3, flex: 1, backgroundColor: '#262629', marginTop: -2, marginBottom: -2, zIndex: 1 },
  textColumn: { flex: 1, marginLeft: 16, paddingTop: 4 },
  stepTitle: { fontSize: 15, fontWeight: '800' },
  stepSub: { fontSize: 12, color: '#8E8E93', marginTop: 4, lineHeight: 16 },

  itemSummaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  itemQuantity: { fontSize: 14, fontWeight: '900' },
  itemName: { fontSize: 14, fontWeight: '700' },
  itemNote: { fontSize: 11, color: '#A1A1AA', fontStyle: 'italic', marginTop: 4 },
  itemPrice: { fontSize: 14, fontWeight: '800' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginTop: 16, marginBottom: 4 },
  emptySubtitle: { color: '#8E8E93', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  dismissBtn: { marginHorizontal: 16, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  dismissBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' }
});