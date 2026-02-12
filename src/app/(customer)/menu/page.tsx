"use client";
import MenuCard from "@/app/UI/MenuCard";
import { keyframes, motion } from "framer-motion";
// import { filter } from "framer-motion/client";

import React, { useEffect, useState } from "react";
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
  const [dishes, setDishes] = useState<any[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let filtered = dishes;
    if (selectedCategory !== "all") {
      if (selectedCategory === "special") {
        filtered = filtered.filter((dish) => dish.isTodaySpecial);
      } else {
        filtered = filtered.filter(
          (dish) => dish.category === setSelectedCategory,
        );
      }
    }
  }, [dishes, selectedCategory]);

  const fetchDishes = async ()=>{
    try{
      setIsLoading(true);
      const response = await fetch("/api/dishes");
      const data = await response.json();
      setDishes(data);
      setIsLoading(false);
      
    } catch(error){
      toast.error("Failed to load menu");
    }finally{
      setIsLoading(false);
    }
  }

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
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dishes"
                  className="w-full pl-10 border border-gray-300 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </motion.div>
            {/* Card Button  */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2">
                <FaUtensils />
                <span>View Cart</span>
              </div>
            </motion.button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-8">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-700">Categories</h2>
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
                 
      </main>
    </div>
  );
}
