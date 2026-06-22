import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const OrderDetailScreen = ({ route, navigation }: any) => {
  const { isDark } = useTheme();
  // Normally this would come from route.params or a context/redux store
  const orderDetails = {
    orderId: '#ORD123456',
    date: 'May 4, 2025',
    status: 'Delivered',
    items: [
      { name: 'Burger', quantity: 2, price: 12.99 },
      { name: 'French Fries', quantity: 1, price: 4.99 },
      { name: 'Cola', quantity: 2, price: 2.99 }
    ],
    subtotal: 36.95,
    deliveryFee: 5.00,
    total: 41.95,
    deliveryAddress: '123 Main St, City, Country',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#fff7ed' }]}>
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
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.reorderButtonText}>Reorder</Text>
      </TouchableOpacity>
    </ScrollView>
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