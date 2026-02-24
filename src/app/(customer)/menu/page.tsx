"use client";
import { useCart } from "@/app/components/providers/CartProvider";
import CartSidebar from "@/app/UI/CartSidebar";
import MenuCard from "@/app/UI/MenuCard";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
// import { div } from "framer-motion/client";
// import { filter } from "framer-motion/client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaFilter,
  FaFire,
  FaGlassCheers,
  FaIceCream,
  FaSearch,
  FaUtensils,
} from "react-icons/fa";
import { GiChickenOven, GiFruitBowl, GiNoodles } from "react-icons/gi";

type Dish = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: "appetizer" | "main" | "dessert" | "beverage" | "special";
  image: string;
  isAvailable: boolean;
  preparationTime: number;
  isTodaysSpecial: boolean;
  ingredients: string[];
  spicyLevel: number;
};
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

const categories = [
  {
    id: "all",
    name: "All Items",
    icon: <FaUtensils />,
    color: "text-gray-600",
  },
  {
    id: "special",
    name: "Today's Special",
    icon: <FaFire />,
    color: "text-red-500",
  },
  {
    id: "appetizer",
    name: "Appetizers",
    icon: <GiFruitBowl />,
    color: "text-green-500",
  },
  {
    id: "main",
    name: "Main Course",
    icon: <GiChickenOven />,
    color: "text-orange-500",
  },
  {
    id: "dessert",
    name: "Desserts",
    icon: <FaIceCream />,
    color: "text-pink-500",
  },
  {
    id: "beverage",
    name: "Beverages",
    icon: <FaGlassCheers />,
    color: "text-blue-500",
  },
];

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const router = useRouter();
  const { getItemCount } = useCart();
  const hasOrder = Boolean(orderDetails && orderDetails.orderId);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowCategory(true); // show again when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchDishes();
  }, []);

  // Load persisted order details (if any) so Track Order on menu works after returning
  useEffect(() => {
    try {
      const saved = localStorage.getItem("orderDetails");
      if (saved) {
        setOrderDetails(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load orderDetails from localStorage", err);
    }
  }, []);

  useEffect(() => {
    let filtered = dishes;
    if (selectedCategory !== "all") {
      if (selectedCategory === "special") {
        filtered = filtered.filter((dish) => dish.isTodaysSpecial);
      } else {
        filtered = filtered.filter(
          (dish) => dish.category === selectedCategory,
        );
      }
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredDishes(filtered);
  }, [dishes, selectedCategory, searchQuery]);

  const fetchDishes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dishes");
      const data = await response.json();
      console.log("API Data: ", data);

      if (!response.ok || !Array.isArray(data)) {
        throw new Error("Invalid API response");
      }

      setDishes(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load menu");
      console.log(error);
      setDishes([]);
    } finally {
      setIsLoading(false);
    }
  };

  //   const searchbtn = (e)=>{
  // setSearchQuery(e.target.value)
  // setsShowCategory(false);
  //   }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // const itemVariants = {
  //   hidden: { y: 20, opacity: 0 },
  //   visible: {
  //     y: 0,
  //     opacity: 1
  //   }
  // };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="p-2 bg-orange-500 rounded-lg ">
                <GiNoodles className="text-2xl text-white " />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Queue Free</h1>
                <p className="text-sm text-gray-600">
                  Because waiting is optional
                </p>
              </div>
            </motion.div>
            {/* search Bar  */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative w-full md:w-96"
            >
              <div className="relative" ref={searchRef}>
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dishes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={() => setShowCategory(false)}
                  className="w-full pl-10 border border-gray-300 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </motion.div>
            {/* Card Button  */}
            <div className="flex items-center justify-between gap-2 w-full  ">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="relative bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <FaUtensils />
                  <span>View Cart</span>
                  {getItemCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    >
                      {getItemCount()}
                    </motion.span>
                  )}
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // onClick={()=>setShowCart(true)}
                onClick={() => {
                  if (hasOrder) {
                    // router.push(`/tracking/${orderDetails!.orderId}`);
                    router.push('/tracking')
                  } else {
                    toast.error("No active order to track");
                  }
                }}
                aria-disabled={!hasOrder}
                className={`relative px-6 py-2 rounded-full font-medium transition-shadow ${
                  hasOrder
                    ? "bg-linear-to-r from-green-500 to-green-900 text-white hover:shadow-lg cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  {hasOrder ? (
                    <div className="flex items-center gap-3">
                      {/* <span className="w-2 h-2 bg-white rounded-full animate-ping"></span> */}
                      <div className="flex items-start flex-col leading-4">
                        <span>Your Order</span>
                        <span className="text-[10px] text-gray-200">
                          {/* {orderDetails!.orderId} */}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span>Your Order</span>
                  )}
                </div>
              </motion.button>
              {/* 
              {hasOrder && (
                <div className="ml-3 text-sm text-gray-700">
                  Tracking: <span className="font-medium">{orderDetails!.orderId}</span>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-8">
        {showCategory && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-700">
                Categories
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
             ${selectedCategory === category.id ? "bg-orange-500 text-white shadow-lg" : "bg-white text-gray-700 shadow hover:shadow-md"}`}
                >
                  <span className={category.color}>{category.icon}</span>
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* menu grid  */}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-4 animate-pulse"
              >
                <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6"
          >
            {filteredDishes.map((dish, index) => (
              // <motion.div
              //   key={dish._id}
              //   variants={itemVariants}
              //   custom={index}
              //   layout
              // >
              <MenuCard key={index} dish={dish} />
              // </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* cardslider  */}
      <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
}
