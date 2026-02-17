'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaClock, FaUtensils, FaCheckCircle, FaMotorcycle,
  FaPrint, FaHome, FaExclamationTriangle, FaSpinner
} from 'react-icons/fa';
import { useSocket } from '@/app/components/providers/SocketProvider';
import toast from 'react-hot-toast';

interface OrderItem {
  dish?: { name: string };
  quantity: number;
  price: number;
}

interface OrderData {
  orderId: string;
  tableNumber: string;
  customerName: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  finalAmount: number;
  estimatedWaitTime: number;
  createdAt: string;
}

const statusSteps = [
  { status: 'pending', label: 'Order Placed', icon: FaClock, color: 'text-yellow-500' },
  // { status: 'confirmed', label: 'Order Confirmed', icon: FaCheckCircle, color: 'text-blue-500' },
  { status: 'preparing', label: 'Preparing', icon: FaUtensils, color: 'text-orange-500' },
  // { status: 'ready', label: 'Ready to Serve', icon: FaMotorcycle, color: 'text-green-500' },
  { status: 'served', label: 'Served', icon: FaCheckCircle, color: 'text-purple-500' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { socket } = useSocket();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${params.orderId}`);
      const data = await response.json();
      setOrder(data);
    } catch {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [params.orderId]);

  useEffect(() => {
    fetchOrder();
    
    if (socket) {
      socket.on('order-updated', (updatedOrder: OrderData) => {
        if (updatedOrder.orderId === params.orderId) {
          setOrder(updatedOrder);
          toast.success('Order status updated!');
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('order-updated');
      }
    };
  }, [params.orderId, socket, fetchOrder]);

  useEffect(() => {
    if (order?.estimatedWaitTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
        setTimeRemaining(Math.max(0, order.estimatedWaitTime - elapsed));
      }, 6000);
      
      return () => clearInterval(interval);
    }
  }, [order]);

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return statusSteps.findIndex(step => step.status === order.status);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you&apos;re looking for doesn&apos;t exist</p>
          <button
            onClick={() => router.push('/menu')}
            className="btn-primary"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Order Tracking
            </h1>
            <p className="text-gray-600">
              Order #{order.orderId} • Table {order.tableNumber}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="relative">
              <div className="flex justify-between mb-8">
                {statusSteps.map((step, index) => (
                  <div key={step.status} className="flex flex-col items-center relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        index <= currentStepIndex
                          ? 'bg-linear-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <step.icon />
                    </motion.div>
                    <span className={`text-sm font-medium ${
                      index <= currentStepIndex ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Progress Line */}
              <div className="absolute top-6 left-12 right-12 h-1 bg-gray-200 -z-10">
                <motion.div
                  className="h-full bg-linear-to-r from-orange-500 to-red-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Estimated Wait Time:</span>
                  <span className="font-bold text-lg flex items-center gap-2">
                    <FaClock className="text-orange-500" />
                    {timeRemaining > 0 ? `${timeRemaining} minutes` : 'Ready Soon!'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Order placed at {new Date(order.createdAt).toLocaleTimeString()}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {order.items?.map((item: OrderItem, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantity} × {item.dish?.name || 'Item'}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-orange-600">
                        ₹{order.finalAmount?.toFixed(2) || order.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Current Status
                </h3>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${
                    order.status === 'pending' ? 'text-yellow-600' :
                    order.status === 'preparing' ? 'text-orange-600' :
                    order.status === 'ready' ? 'text-green-600' :
                    'text-purple-600'
                  }`}>
                    {order.status?.toUpperCase()}
                  </span>
                  {order.status === 'preparing' && (
                    <FaSpinner className="text-orange-500 animate-spin" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {order.status === 'pending' && 'Your order has been received'}
                  {order.status === 'preparing' && 'Our chefs are preparing your food'}
                  {order.status === 'ready' && 'Your order is ready for pickup'}
                  {order.status === 'served' && 'Enjoy your meal!'}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Table:</span>
                    <span className="font-medium">{order.tableNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Time:</span>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Updates */}
          <div className="mb-8 p-4 bg-linear-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full relative"></div>
              </div>
              <span className="font-medium">Live Tracking Active</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              You&apos;ll receive real-time updates about your order status
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handlePrintInvoice}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FaPrint /> Print Invoice
            </button>
            
            <button
              onClick={() => router.push('/menu')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <FaHome /> Back to Menu
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}