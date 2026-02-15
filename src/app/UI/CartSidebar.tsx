'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCart } from '../components/providers/CartProvider';
import Image from 'next/image';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    onClose();
    router.push('/checkout');
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // const tax = getTotal() * 0.1;
  // const serviceCharge = getTotal() * 0.05;
  // const total = getTotal() + tax + serviceCharge;
  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <FaShoppingCart className="text-orange-500 text-xl" />
                <h2 className="text-xl font-bold text-gray-800">Your Order</h2>
                {getItemCount() > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {getItemCount()} items
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-300 mb-4">
                    <FaShoppingCart className="text-6xl mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add some delicious dishes to get started!
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-primary text-gray-600"
                  >
                    Browse Menu
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 p-3 bg-gray-50 rounded-lg border"
                    >
                      {item.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            height={100}
                            width={100}
                            // fill={false}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <span className="font-bold text-orange-600">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-600"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            
                            <span className="font-medium w-8 text-center text-gray-600">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-200 transition-colors"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item._id)}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Cart Summary */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div> */}
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Charge (5%)</span>
                    <span>₹{serviceCharge.toFixed(2)}</span>
                  </div> */}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-600">
                    <span>Total</span>
                    <span className="text-orange-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="flex-1 bg-linear-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
                  >
                    Checkout
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}