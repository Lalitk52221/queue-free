"use client";
import React from "react";
import { FaSearch, FaUtensils } from "react-icons/fa";
import { GiNoodles } from "react-icons/gi";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-orange-50">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="p-2 bg-orange-500 rounded-lg ">
              <GiNoodles className="text-2xl text-white " />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Queue Free</h1>
              <p className="text-sm text-gray-600">
                Because waiting is optional
              </p>
            </div>

            {/* search Bar  */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes"
                className="w-full pl-10 border border-gray-300 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Card Button  */}
            <div className="flex items-center gap-2">
              <FaUtensils />
              <span>View Cart</span>
            </div>
          </div>
        </div>
      </header>
      menu
    </div>
  );
}
