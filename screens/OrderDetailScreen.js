import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const OrderDetailScreen = ({ route, navigation }) => {
  const { isDark } = useTheme();

  // Animation setup
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Normally this would come from route.params or a context/redux store
  const orderDetails = {
    orderId: '#ORD123456',
    date: 'AUgust 31, 2025',
    status: 'Delivered',
    items: [
      { name: 'Burger', quantity: 1, price: 8.99 },
      { name: 'Ramen', quantity: 1, price: 11.99 },
      { name: 'Brownie', quantity: 1, price: 6.99 }
    ],
    subtotal: 25.97,
    deliveryFee: 5.00,
    total: 30.97,
    deliveryAddress: '123456 ,  Main Street , Attock , Punjab ',
  };

  return (

    <Animated.ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111827' : '#fff7ed' },
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <SafeAreaView>
        <View style={styles.section}>
          <Text style={[styles.orderNumber, { color: isDark ? '#fff' : '#000' }]}>
            Order {orderDetails.orderId}
          </Text>
          <Text style={[styles.date, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {orderDetails.date}
          </Text>
          <View style={[styles.statusContainer, { backgroundColor: '#22c55e20' }]}>
            <Text style={[styles.status, { color: '#22c55e' }]}>{orderDetails.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>Items</Text>
          {orderDetails.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: isDark ? '#fff' : '#000' }]}>{item.name}</Text>
                <Text style={[styles.itemQuantity, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                  x{item.quantity}
                </Text>
              </View>
              <Text style={[styles.itemPrice, { color: isDark ? '#fff' : '#000' }]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>Delivery Address</Text>
          <Text style={[styles.address, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {orderDetails.deliveryAddress}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Subtotal</Text>
            <Text style={[styles.totalAmount, { color: isDark ? '#fff' : '#000' }]}>
              ${orderDetails.subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Delivery Fee</Text>
            <Text style={[styles.totalAmount, { color: isDark ? '#fff' : '#000' }]}>
              ${orderDetails.deliveryFee.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={[styles.totalLabel, { color: isDark ? '#fff' : '#000', fontWeight: 'bold' }]}>Total</Text>
            <Text style={[styles.totalAmount, { color: isDark ? '#fff' : '#000', fontWeight: 'bold' }]}>
              ${orderDetails.total.toFixed(2)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reorderButton}
          onPress={() => navigation.navigate('CartTab')}
        >
          <Text style={styles.reorderButtonText}>Reorder</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f97316',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    marginBottom: 10,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  address: {
    fontSize: 16,
    lineHeight: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 16,
  },
  finalTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f97316',
  },
  reorderButton: {
    backgroundColor: '#f97316',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  reorderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailScreen;
