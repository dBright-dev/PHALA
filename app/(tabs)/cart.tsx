import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';
import { supabase } from '../../config/supabase';
import { ShoppingBag, CreditCard } from 'lucide-react-native';

export default function CartScreen() {
  // Pull values clean from context hooks
  const { cart, getCartTotal, checkoutOrder } = useCart();
  const router = useRouter();
  
  // Local state managers
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Basket', 'Your basket is currently empty. Head over to the menu to grab a Kota first!');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Extract the active logged-in user profile metadata
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fall back gracefully to metadata display name or email parameters
      const verifiedCustomerName = user?.user_metadata?.display_name || user?.email || 'Anonymous Guest';

      // Execute the context Supabase insert operation
      const newOrderId = await checkoutOrder(verifiedCustomerName);

      if (newOrderId) {
        // Dynamic programmatic routing: pushes the user straight to your status tracking board
        router.push({
          pathname: '/tracking',
          params: { orderId: newOrderId }
        });
      } else {
        Alert.alert('Network Disturbance', 'We could not submit your transaction to the kitchen. Please check your data connection and retry.');
      }
    } catch (error) {
      console.error('Checkout routing failure:', error);
      Alert.alert('Error', 'An unexpected error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Your Basket</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyView}>
          <ShoppingBag size={48} color="#48484A" />
          <Text style={styles.emptyText}>Your basket is looking hungry...</Text>
        </View>
      ) : (
        <>
          {/* Simple Row Item Renderer */}
          <FlatList
            data={cart}
            keyExtractor={(item, idx) => `${item.id}-${idx}`}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>R{item.price * item.quantity}</Text>
                </View>
                {/* CRITICAL: Ensure both locations below use item.notes with an "s" */}
                {item.notes ? <Text style={styles.itemNotes}>📝 {item.notes}</Text> : null}
              </View>
            )}
            style={{ flex: 1 }}
          />

          {/* CHECKOUT CALCULATION FOOTER PANEL */}
          <View style={styles.footerPanel}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Due:</Text>
              <Text style={styles.totalAmount}>R{getCartTotal()}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.checkoutBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <CreditCard size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.checkoutBtnText}>Send to Kitchen (Pay on Collection)</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#09090B', padding: 16, paddingTop: 60 },
//   headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 20 },
  
//   // Empty View Styles
//   emptyView: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
//   emptyText: { color: '#8E8E93', fontSize: 14, fontWeight: '600' },

//   // List Item Styles
//   itemCard: { backgroundColor: '#161618', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#262629', marginBottom: 10 },
//   itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   itemQuantity: { color: '#FF7600', fontWeight: '900', fontSize: 14 },
//   itemName: { color: '#FFF', fontWeight: '700', fontSize: 14, flex: 1 },
//   itemPrice: { color: '#FFF', fontWeight: '800', fontSize: 14 },
//   itemNotes: { color: '#A1A1AA', fontSize: 12, marginTop: 6, fontStyle: 'italic', backgroundColor: '#0D0D0E', padding: 6, borderRadius: 6 },

//   // Footer Actions
//   footerPanel: { borderTopWidth: 1, borderTopColor: '#262629', paddingTop: 16, paddingBottom: 20 },
//   totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
//   totalLabel: { color: '#8E8E93', fontSize: 15, fontWeight: '700' },
//   totalAmount: { color: '#FF7600', fontSize: 24, fontWeight: '900' },
//   checkoutBtn: { backgroundColor: '#FF7600', height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
//   checkoutBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' }
// });
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#09090B', 
    padding: 16, 
    paddingTop: 60 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#FFF', 
    marginBottom: 20 
  },
  emptyView: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  emptyText: { 
    color: '#8E8E93', 
    fontSize: 14, 
    fontWeight: '600',
    marginTop: 12
  },
  itemCard: { 
    backgroundColor: '#161618', 
    padding: 14, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#262629', 
    marginBottom: 10 
  },
  itemRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  itemQuantity: { 
    color: '#FF7600', 
    fontWeight: '900', 
    fontSize: 14,
    marginRight: 10
  },
  itemName: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 14, 
    flex: 1 
  },
  itemPrice: { 
    color: '#FFF', 
    fontWeight: '800', 
    fontSize: 14,
    marginLeft: 10
  },
  itemNotes: { 
    color: '#A1A1AA', 
    fontSize: 12, 
    marginTop: 6, 
    fontStyle: 'italic', 
    backgroundColor: '#0D0D0E', 
    padding: 6, 
    borderRadius: 6,
    overflow: 'hidden'
  },
  footerPanel: { 
    borderTopWidth: 1, 
    borderTopColor: '#262629', 
    paddingTop: 16, 
    paddingBottom: 20 
  },
  totalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  totalLabel: { 
    color: '#8E8E93', 
    fontSize: 15, 
    fontWeight: '700' 
  },
  totalAmount: { 
    color: '#FF7600', 
    fontSize: 24, 
    fontWeight: '900' 
  },
  checkoutBtn: { 
    backgroundColor: '#FF7600', 
    height: 50, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row' 
  },
  checkoutBtnText: { 
    color: '#FFF', 
    fontSize: 14, 
    fontWeight: '900' 
  }
});