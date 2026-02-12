import React from 'react'
import { motion } from 'framer-motion';
import { FaClock, FaFire } from 'react-icons/fa';

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

export default function MenuCard({dish}: MenuCardProps) {
  return (
    <div>
        <h1>Menu Card</h1>
        {dish.name}
        {dish.description}
        {dish.price}

    </div>
  )
}
