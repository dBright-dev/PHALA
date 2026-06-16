import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';
import { ChefHat, ChefHat as PrepIcon, Clock, PackageCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Explicitly define the local status weight mapping type constraints
type ValidStatus = 'none' | 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED';

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { activeOrders, clearActiveOrder } = useCart();

  // Helper function with fixed, strict string explicit type indexing
  const getStepStatus = (currentStatus: ValidStatus, step: 'RECEIVED' | 'PREPARING' | 'READY') => {
    const statusWeights: Record<ValidStatus, number> = { 
      none: 0, 
      RECEIVED: 1, 
      PREPARING: 2, 
      READY: 3, 
      COMPLETED: 4 
    };
    
    const currentWeight = statusWeights[currentStatus] || 0;
    const stepWeight = statusWeights[step];

    if (currentWeight > stepWeight) return 'completed';
    if (currentWeight === stepWeight) return 'active';
    return 'pending';
  };

  // Safe fallback layout check across your activeOrders state tracker collection array
  if (!activeOrders || activeOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Clock size={64} color="#727274" strokeWidth={1.5} />
        <Text style={styles.emptyTitle}>No Active Orders</Text>
        <Text style={styles.emptySubtitle}>You don't have an order cooking right now. Check the menu boards to place a new one!</Text>
        <TouchableOpacity style={styles.backMenuBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.backMenuBtnText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Track Your Orders</Text>
        <Text style={styles.orderIdText}>{activeOrders.length} Live Monitor Connection{activeOrders.length > 1 ? 's' : ''} Active</Text>
      </View>

      {/* Loop through each active kitchen ticket dynamically */}
      {activeOrders.map((order, orderIdx) => {
        const { id, currentOrderStatus, activeOrderItems } = order;

        return (
          <View key={id || `order-${orderIdx}`} style={styles.orderCardGroup}>
            <View style={styles.orderDivider}>
              <Text style={styles.orderDividerText}>ORDER REFERENCE: #{id ? id.substring(0, 8).toUpperCase() : orderIdx + 1}</Text>
            </View>

            {/* STEP GRAPH FLOW LINES FOR THIS SPECIFIC TICKET */}
            <View style={styles.cardPanel}>
              {/* Step 1: Received */}
              <View style={styles.timelineRow}>
                <View style={styles.iconColumn}>
                  <View style={[styles.statusCircle, 
                    (getStepStatus(currentOrderStatus, 'RECEIVED') === 'active' || getStepStatus(currentOrderStatus, 'RECEIVED') === 'completed') && { backgroundColor: '#FF7600' }
                  ]}>
                    <Clock size={16} color="#FFF" />
                  </View>
                  <View style={[styles.connectorLine, getStepStatus(currentOrderStatus, 'PREPARING') !== 'pending' && { backgroundColor: '#FF7600' }]} />
                </View>
                <View style={styles.textColumn}>
                  <Text style={[styles.stepTitle, getStepStatus(currentOrderStatus, 'RECEIVED') === 'active' && { color: '#FF7600' }]}>Order Received</Text>
                  <Text style={styles.stepSub}>Your order is securely sent to the kitchen counter queue.</Text>
                </View>
              </View>

              {/* Step 2: Preparing */}
              <View style={styles.timelineRow}>
                <View style={styles.iconColumn}>
                  <View style={[styles.statusCircle, 
                    (getStepStatus(currentOrderStatus, 'PREPARING') === 'active' || getStepStatus(currentOrderStatus, 'PREPARING') === 'completed') && { backgroundColor: '#FF7600' }
                  ]}>
                    <ChefHat size={16} color="#FFF" />
                  </View>
                  <View style={[styles.connectorLine, getStepStatus(currentOrderStatus, 'READY') !== 'pending' && { backgroundColor: '#34C759' }]} />
                </View>
                <View style={styles.textColumn}>
                  <Text style={[styles.stepTitle, getStepStatus(currentOrderStatus, 'PREPARING') === 'active' && { color: '#FF7600' }]}>On the Grill</Text>
                  <Text style={styles.stepSub}>Thabang's crew is crafting and frying up your specific combination request.</Text>
                </View>
              </View>

              {/* Step 3: Ready */}
              <View style={styles.timelineRow}>
                <View style={styles.iconColumn}>
                  <View style={[styles.statusCircle, currentOrderStatus === 'READY' && { backgroundColor: '#34C759' }]}>
                    <PackageCheck size={16} color="#FFF" />
                  </View>
                </View>
                <View style={styles.textColumn}>
                  <Text style={[styles.stepTitle, currentOrderStatus === 'READY' && { color: '#34C759' }]}>Ready for Pick Up</Text>
                  <Text style={styles.stepSub}>Packaged hot! Head directly over to the pickup stall area.</Text>
                </View>
              </View>
            </View>

            {/* ITEMS SNAPSHOT RECAP LIST FOR THIS SPECIFIC TICKET */}
            <Text style={styles.sectionHeading}>Items in Production</Text>
            <View style={styles.cardPanel}>
              {activeOrderItems.map((item, idx) => (
                <View key={`${item.id}-${idx}`} style={[styles.itemSummaryRow, idx !== activeOrderItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#262629' }]}>
                  <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.notes ? <Text style={styles.itemNote}>📝 "{item.notes}"</Text> : null}
                  </View>
                  <Text style={styles.itemPrice}>R{item.price * item.quantity}</Text>
                </View>
              ))}
            </View>

            {/* SAFE LAMBDA WRAPPER: Passes the specific order execution ID token backwards */}
            {currentOrderStatus === 'READY' && (
              <TouchableOpacity 
                style={styles.dismissBtn} 
                onPress={() => clearActiveOrder(id)}
              >
                <Text style={styles.dismissBtnText}>I Have Collected This Food</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090B' },
  header: { padding: 24, paddingTop: 64, paddingBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  orderIdText: { fontSize: 13, color: '#FF7600', fontWeight: '700', marginTop: 4 },
  
  orderCardGroup: { marginBottom: 12 },
  orderDivider: { marginHorizontal: 24, marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#262629', paddingBottom: 6 },
  orderDividerText: { fontSize: 11, fontWeight: '900', color: '#727274', letterSpacing: 0.5 },

  cardPanel: { backgroundColor: '#161618', marginHorizontal: 24, borderRadius: 20, borderWidth: 1, borderColor: '#262629', padding: 20, marginTop: 12, marginBottom: 4 },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#8E8E93', marginHorizontal: 24, marginTop: 16, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  
  timelineRow: { flexDirection: 'row', minHeight: 74 },
  iconColumn: { alignItems: 'center', width: 24 },
  statusCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#262629', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  connectorLine: { width: 2, flex: 1, backgroundColor: '#262629', marginTop: -2, marginBottom: -2, zIndex: 1 },
  textColumn: { flex: 1, marginLeft: 16 },
  stepTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  stepSub: { fontSize: 12, color: '#8E8E93', marginTop: 3, lineHeight: 16 },

  itemSummaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  itemQuantity: { fontSize: 14, fontWeight: '900', color: '#FF7600' },
  itemName: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  itemNote: { fontSize: 12, color: '#E4E4E7', fontStyle: 'italic', marginTop: 4, opacity: 0.8 },
  itemPrice: { fontSize: 14, fontWeight: '800', color: '#FFF' },

  emptyContainer: { flex: 1, backgroundColor: '#09090B', justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginTop: 16 },
  emptySubtitle: { color: '#8E8E93', fontSize: 14, textAlign: 'center', marginTop: 6, paddingHorizontal: 16, lineHeight: 20 },
  backMenuBtn: { backgroundColor: '#161618', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 24, borderWidth: 1, borderColor: '#262629' },
  backMenuBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  dismissBtn: { backgroundColor: '#34C759', marginHorizontal: 24, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 20, marginTop: 14 },
  dismissBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' }
});