"use client"
import React, { useState } from 'react'

import { motion } from 'framer-motion';
import { FaCheckCircle, FaReceipt, FaTable, FaUser } from 'react-icons/fa';
import { useCart } from '@/app/components/providers/CartProvider';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface OrderItem {
  dish: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

interface OrderDetails {
  orderId: string;
  tableNumber: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  finalAmount: number;
  estimatedWaitTime: number;
  invoiceNumber: string;
  status: string;
}

export default function CheckoutPage() {
  const [step,setStep] = useState(1);
  // const [paymentMethod, setPaymentMethod] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  // const [qrCode, setQrCode] = useState('');
  const {items,clearCart, getTotal} = useCart();
   const router = useRouter();
  const [formData,setFormData] = useState({
    customerName: '',
    tableNumber: '',
    specialInstructions: '',
  });

  const steps = [
    { number: 1, title: 'Order Details', icon: <FaUser /> },
    // { number: 2, title: 'Payment', icon: <FaCreditCard /> },
    { number: 3, title: 'Confirmation', icon: <FaCheckCircle /> },
  ];

  // const handleNext = ()=>{
  //   if(step===1 && (!formData.customerName || !formData.tableNumber)){
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }
  //   setStep(step+1);
  // }
// const handleBack = () => {
//     if (step > 1) setStep(step - 1);
//   };

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            dishId: item._id,
            quantity: item.quantity,
            specialInstructions: formData.specialInstructions,
          })),
          customerName: formData.customerName,
          tableNumber: formData.tableNumber,
          restaurantId: '65d4a1b2e3f4a7c8d9e0f123',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setOrderDetails(data.order);
        try {
          localStorage.setItem('orderDetails', JSON.stringify(data.order));
        } catch (e) {
          console.error('Failed to save order to localStorage', e);
        }
        
        // if (paymentMethod === 'qr') {
        //   const qr = await QRCode.toDataURL(
        //     `${window.location.origin}/payment/${data.order.orderId}`
        //   );
        //   setQrCode(qr);
        // }
        
        setStep(3);
        clearCart();
        toast.success('Order placed successfully!');
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  const subtotal = getTotal();
  const total = subtotal ;
  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-purple-50 py-8'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in 3 simple steps</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            {steps.map((s, index) => (
              <div key={s.number} className="flex flex-col items-center z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                    step >= s.number ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  {s.icon}
                </motion.div>
                <span className="text-sm font-medium ">{s.title}</span>
              </div>
            ))}
            <div className="absolute top-7 left-12 right-12 h-1 bg-gray-300 -z-10">
              <motion.div
                className="h-full bg-linear-to-r from-orange-500 to-red-500"
                initial={{ width: '0%' }}
                animate={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
              {/* Step 1: Order Details */}
            {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-6 ">Order Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    className="input-field pl-10 outline rounded-md"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Number *
                </label>
                <div className="relative">
                  <FaTable className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.tableNumber}
                    onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
                    className="input-field pl-10 outline rounded-md"
                    placeholder="e.g., Table 5"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                className="input-field h-32 w-full p-4  rounded-md resize-none"
                placeholder="Any special requests or dietary restrictions?"
              />
            </div>
            
            {/* Order Summary */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold  mb-4">Order Summary</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <div className="border-t pt-3 space-y-2">
                  {/* <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div> */}
                  {/* <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (10%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div> */}
                  {/* <div className="flex justify-between text-sm text-gray-600">
                    <span>Service Charge (5%)</span>
                    <span>₹{serviceCharge.toFixed(2)}</span>
                  </div> */}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-orange-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className=" btn-primary py-3 text-lg "
              >
                Proceed to Next
              </motion.button>
            </div> */}
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                className="px-3 rounded-md  btn-primary bg-amber-500 py-3 text-lg "
              >
                Place Order
              </motion.button>
            </div>
          </motion.div>
        )}

{/* Step 2: Payment */}
        {/* {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPaymentMethod('qr')}
                className={`p-6 border-2 rounded-xl flex flex-col items-center transition-all ${
                  paymentMethod === 'qr' 
                    ? 'border-orange-500 bg-orange-50 shadow-lg' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <FaQrcode className="text-4xl mb-3 text-orange-500" />
                <span className="font-medium">QR Code</span>
                <span className="text-sm text-gray-500 mt-1">Scan to pay</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPaymentMethod('card')}
                className={`p-6 border-2 rounded-xl flex flex-col items-center transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <FaCreditCard className="text-4xl mb-3 text-blue-500" />
                <span className="font-medium">Card Payment</span>
                <span className="text-sm text-gray-500 mt-1">Credit/Debit Card</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPaymentMethod('cash')}
                className={`p-6 border-2 rounded-xl flex flex-col items-center transition-all ${
                  paymentMethod === 'cash' 
                    ? 'border-green-500 bg-green-50 shadow-lg' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <FaCashRegister className="text-4xl mb-3 text-green-500" />
                <span className="font-medium">Cash</span>
                <span className="text-sm text-gray-500 mt-1">Pay at counter</span>
              </motion.button>
            </div>

            {paymentMethod && (
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-bold mb-4">Payment Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Total:</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                  
                  {paymentMethod === 'qr' && (
                    <div className="text-center">
                      <p className="mb-4 text-gray-600">
                        Scan the QR code with your payment app
                      </p>
                      {qrCode ? (
                        <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
                      ) : (
                        <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                          QR Code will appear after order placement
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <FaArrowLeft /> Back
              </button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={!paymentMethod}
                className={`flex-1 py-3 rounded-lg font-bold ${
                  paymentMethod
                    ? 'bg-orange-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Place Order & Pay
              </motion.button>
            </div>
          </motion.div>
        )} */}

        {/* step 3 Confirm Order  */}
        {step === 3 && orderDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Order Confirmed!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Thank you for your order. Your food is being prepared.
            </p>
            
            <div className="bg-linear-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-bold text-orange-600">
                    {orderDetails.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Table:</span>
                  <span className="font-medium">{orderDetails.tableNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Wait Time:</span>
                  <span className="font-medium">
                    {orderDetails.estimatedWaitTime} minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg">
                    ₹{orderDetails.finalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* {qrCode && (
              <div className="mb-8">
                <h3 className="font-bold mb-4">Scan to Pay</h3>
                <img src={qrCode} alt="Payment QR Code" className="w-48 h-48 mx-auto" />
              </div>
            )} */}
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push(`/tracking/${orderDetails.orderId}`)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaReceipt /> Track Order
              </button>
              
              <button
                onClick={() => router.push('/menu')}
                className="px-6 py-3 border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    
  )
}
