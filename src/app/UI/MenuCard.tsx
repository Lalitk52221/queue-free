
'use client';

import { motion } from 'framer-motion';
import { FaStar, FaClock, FaFire, FaLeaf } from 'react-icons/fa';
// import { useCart } from '@/components/providers/CartProvider';
// import toast from 'react-hot-toast';
import Image from 'next/image';

interface MenuCardProps {
  dish: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    preparationTime: number;
    isTodaysSpecial: boolean;
    spicyLevel: number;
    ingredients: string[];
  };
}

export default function MenuCard({ dish }: MenuCardProps) {
  // const { addItem } = useCart();

  // const handleAddToCart = () => {
  //   addItem({
  //     _id: dish._id,
  //     name: dish.name,
  //     price: dish.price,
  //     quantity: 1,
  //     image: dish.image,
  //   });
  // };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={dish.image || '/images/default-dish.jpg'}
          alt={dish.name}
          fill={true}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {dish.isTodaysSpecial && (
            <motion.span
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              className="bg-linear-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
            >
              <FaFire className="text-xs" /> SPECIAL
            </motion.span>
          )}
          
          {dish.spicyLevel > 0 && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
              {/* {Array.from({ length: dish.spicyLevel }).map((_, i) => '🌶️')} */}
            </span>
          )}
        </div>
        
        {/* Preparation Time */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <FaClock className="text-xs" /> {dish.preparationTime} min
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{dish.name}</h3>
          <span className="text-orange-600 font-bold text-lg">
            ₹{dish.price.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {dish.description}
        </p>

        {/* Ingredients */}
        {dish.ingredients && dish.ingredients.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <FaLeaf className="text-green-500" />
              <span>Ingredients:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {dish.ingredients.slice(0, 3).map((ingredient, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {ingredient}
                </span>
              ))}
              {dish.ingredients.length > 3 && (
                <span className="text-gray-400 text-xs">+{dish.ingredients.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Category */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {dish.category}
          </span>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
        >
          <span>Add to Cart</span>
          <span className="text-lg">+</span>
        </motion.button> */}
      </div>
    </motion.div>
  );
}