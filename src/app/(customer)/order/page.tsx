// "use client";
// import { i } from "framer-motion/client";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// interface OrderItem {
//   dish?: { image: string; name: string };
//   quantity: number;
//   price: number;
//   specialInstructions?: string;
// }

// interface OrderDetails {
//   orderId: string;
//   tableNumber: string;
//   customerName: string;
//   items: OrderItem[];
//   totalAmount: number;
//   finalAmount: number;
//   estimatedWaitTime: number;
//   invoiceNumber: string;
//   status: string;
//   updatedAt: string;
// }

// export default function OrderPage() {
//   const [orderData, setOrderData] = useState<OrderDetails | null>(null);

//   // const formattedDate = new Date().toLocaleDateString("en-GB");

//   const formattedDate = (d) => {
//     const date = new Date(d).toLocaleDateString("en-GB");
//     return date;
//   };

//   const fetchOrder = async () => {
//     try {
//       const response = await fetch("/api/orders");
//       const data = await response.json();
//       console.log(data);
//       setOrderData(data);

//       // setOrderData(await data)
//     } catch (error) {
//       toast.error("failed to load menu");
//       console.log(error);
//       // setOrderData(null)
//     }
//   };
//   useEffect(() => {
//     fetchOrder();
//   }, []);
//   return (
//     <div className="w-full h-full p-5 flex items-center justify-center flex-col gap-5 border">
//       <h1 className="text-2xl font-bold">Your Order</h1>
//       {!orderData ? (
//         <div>
//           <p>Your Cart is empty</p>
//         </div>
//       ) : (
//         orderData.map((order, i) => (
//           <div key={i} className="flex flex-col gap-6">
//             <div className="border border-gray-200 rounded-lg shadow-sm w-full p-4 bg-white">
//               {/* Product Images */}
//               <div className="flex items-center justify-between gap-3">
//                 {order.items?.map((d: OrderItem, i: number) => (
//                   <div key={i} className="text-center ">
//                   <Image
//                 src={d.dish.image}
//                 alt="Empty Cart"
//                 width={60}
//                 height={50}
//                 className="border rounded-md shadow-sm"
//                 />
//                <span className="text-xs"> {d.dish.name}</span>
//                 </div>
//               ))}
                
//                 {/* <span className="text-sm font-medium text-gray-600">
//                   + 1 more
//                 </span> */}
//               </div>

//               {/* Order Info */}
//               <div className="flex items-center justify-between border-t mt-4 pt-3">
//                 <div className="flex flex-col text-sm text-gray-500">
//                   <span className="font-medium text-gray-700">
//                     Order Placed
//                   </span>
//                   <span>{formattedDate(order.createdAt)}</span>
//                   <p className="text-green-600 font-semibold">Delivered</p>
//                 </div>
//                 <div className="text-sm font-bold text-gray-800 flex items-center gap-1">
//                   <span>Rs. {order.finalAmount}</span>
//                   <span className="text-orange-500 text-lg">→</span>
//                 </div>
//               </div>

//               {/* Button */}
//               <div className="mt-2 pt-2 flex justify-end border-t">
//                 <button className="bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-orange-600 transition">
//                   View Invoice
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
