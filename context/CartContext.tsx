import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToastAndroid, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

// Representing a distinct active order ticket item
interface ActiveOrder {
  id: string;
  currentOrderStatus: 'none' | 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED';
  activeOrderItems: CartItem[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: any, quantity: number, notes?: string) => void;
  removeFromCart: (itemId: string, notes?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  checkoutOrder: (customerName: string) => Promise<string | null>;
  // Expose the complete multi-order array to the tracking screen
  activeOrders: ActiveOrder[];
  clearActiveOrder: (orderId: string) => Promise<void>; // Now expects an ID parameter
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const showToast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  } else {
    Alert.alert('Thabang Kitchen', message, [{ text: 'OK' }], { cancelable: true });
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  // Store all incomplete active orders in a clean state array
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);

  // 1. ASYNCSTORAGE: Save basket data locally whenever it changes
  useEffect(() => {
    const saveCartToDeviceMemory = async () => {
      try {
        await AsyncStorage.setItem('@thabang_food_cart', JSON.stringify(cart));
      } catch (err) {
        console.error('Failed storing cart local snapshot:', err);
      }
    };
    if (cart.length > 0) saveCartToDeviceMemory();
  }, [cart]);

  // 2. LIFECYCLE INITIALIZER: Load saved cart and look for ALL unfinished active orders on boot
  useEffect(() => {
    const initializeUserState = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('@thabang_food_cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .neq('status', 'COMPLETED')
            .order('created_at', { ascending: false }); // Drop .limit(1) to get all active tickets

          if (!error && data) {
            const mappedOrders: ActiveOrder[] = data.map((order: any) => ({
              id: order.id,
              currentOrderStatus: (order.status || 'RECEIVED').toUpperCase(),
              activeOrderItems: order.items || [],
            }));
            setActiveOrders(mappedOrders);
          }
        }
      } catch (err) {
        console.error('Initialization breakdown:', err);
      }
    };

    initializeUserState();
  }, []);

  // 3. REAL-TIME SUBSCRIPTION HOOK: Watch the database for updates to any order belonging to the user
  useEffect(() => {
    let trackingChannel: any;

    const setupUserSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Filter events matching updates specifically matching this user's ID row attribute
      trackingChannel = supabase
        .channel(`user-multi-order-tracking-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
          (payload) => {
            const updatedRecord = payload.new;
            if (!updatedRecord) return;

            const normalizedStatus = (updatedRecord.status || 'RECEIVED').toUpperCase();

            setActiveOrders((prevOrders) => {
              // If the kitchen flags it complete, remove it from our active view state array completely
              if (normalizedStatus === 'COMPLETED') {
                showToast(`Order #${updatedRecord.id} finalized and cleared!`);
                return prevOrders.filter(o => o.id !== updatedRecord.id);
              }

              // Otherwise, update the matching order inline safely
              return prevOrders.map((order) => {
                if (order.id === updatedRecord.id) {
                  return {
                    ...order,
                    currentOrderStatus: normalizedStatus,
                    activeOrderItems: updatedRecord.items || order.activeOrderItems
                  };
                }
                return order;
              });
            });
          }
        )
        .subscribe();
    };

    setupUserSubscription();

    return () => {
      if (trackingChannel) supabase.removeChannel(trackingChannel);
    };
  }, []);

  const addToCart = (item: any, quantity: number, notes?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === item.id && i.notes === notes);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        showToast(`Updated quantity for ${item.name} in basket!`);
        return updated;
      }
      showToast(`Added ${quantity}x ${item.name} to basket!`);
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity, notes }];
    });
  };

  const removeFromCart = (itemId: string, notes?: string) => {
    setCart((prev) => prev.filter((i) => !(i.id === itemId && i.notes === notes)));
  };

  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem('@thabang_food_cart');
  };

  const getCartTotal = () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Clear specific individual active ticket out by its row tracking ID string
  const clearActiveOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'COMPLETED' })
        .eq('id', orderId);

      if (error) throw error;

      // Drop cleared ticket locally out of view state hook right away
      setActiveOrders((prev) => prev.filter(o => o.id !== orderId));
      showToast('Enjoy your meal! Order closed.');
    } catch (err) {
      console.error('Failed clearing order from backend:', err);
      showToast('Error updating collection status. Try again.');
    }
  };

  const checkoutOrder = async (customerName: string): Promise<string | null> => {
    if (cart.length === 0) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Missing verified session tokens');

      const orderItemsSnapshot = [...cart];
      const totalCost = getCartTotal();

      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            customer_name: customerName,
            items: orderItemsSnapshot,
            total_price: totalCost,
            status: 'RECEIVED',
          },
        ])
        .select();

      if (error) throw error;

      const createdOrder = data?.[0];
      if (createdOrder) {
        // Append the new order ticket immediately into your active tracking state dashboard stack
        const newActiveTicket: ActiveOrder = {
          id: createdOrder.id,
          currentOrderStatus: 'RECEIVED',
          activeOrderItems: orderItemsSnapshot
        };
        setActiveOrders((prev) => [newActiveTicket, ...prev]);
        
        await clearCart();
        showToast('Order successfully sent to Thabang Kitchen!');
        return createdOrder.id;
      }
      return null;
    } catch (err) {
      console.error('Checkout failed:', err);
      showToast('Checkout failed. Please check network connection.');
      return null;
    }
  };

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart, getCartTotal,
      checkoutOrder, activeOrders, clearActiveOrder
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be executed under a CartProvider template.');
  return context;
};