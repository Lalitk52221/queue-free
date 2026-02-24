"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";
// import { useCart } from "@/app/components/providers/CartProvider";

interface StoredOrder {
  orderId: string;
  status?: string;
  createdAt?: string;
  finalAmount?: number;
  clientId: string;
}

export default function TrackingIndexPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const router = useRouter();
  // const {activeOrders} = useCart();

  useEffect(() => {
    const load = () => {
      try {
        const clientId = localStorage.getItem('clientId');
        if (!clientId) {
          setOrders([]);
          return;
        }
        const raw = localStorage.getItem("orders");
        const arr: StoredOrder[] = raw ? JSON.parse(raw) : [];
        // only show orders created by this device and not completed
        const active = arr.filter(o => o.clientId === clientId);
        // const active = arr.filter(o => o.clientId === clientId && o.status !== "served" && o.status !== "cancelled");
        setOrders(active);
        
      } catch (e) {
        console.error("Failed to load orders from localStorage", e);
        setOrders([]);
      }
    };

    load();

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === "orders" || ev.key === 'clientId') load();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-4">Your Active Orders</h1>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <FaExclamationTriangle className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-600">No active orders found</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li key={o.orderId} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-bold">{o.orderId}</div>
                    <div className="text-sm text-gray-500">{o.status || 'pending'}</div>
                    {o.createdAt && <div className="text-xs text-gray-400">Placed: {new Date(o.createdAt).toLocaleString()}</div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => router.push(`/tracking/${o.orderId}`)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      Track
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
