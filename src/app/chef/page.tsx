"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Order = {
  _id: string;
  orderId: string;
  status: string;
  createdAt: string;
  items?: unknown[];
};

const FLOW = ["pending", "confirmed", "preparing", "ready", "served"];

export default function ChefPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (!res.ok) throw new Error('Failed');
      setOrders(data || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      if (res.ok) {
        toast.success(`Order ${orderId} -> ${newStatus}`);
        // update local list
        setOrders((prev) => prev.map(o => o.orderId === updated.orderId ? updated : o));

        // Sync to localStorage for customers on same machine
        try {
          const raw = localStorage.getItem('orders');
          const arr = raw ? JSON.parse(raw) : [];
          const idx = arr.findIndex((a: any) => a.orderId === updated.orderId);
          let finalOrder = updated;
          if (idx >= 0) {
            // preserve clientId or other local-only fields
            finalOrder = { ...arr[idx], ...updated };
            arr[idx] = finalOrder;
          } else {
            arr.unshift(finalOrder);
          }
          localStorage.setItem('orders', JSON.stringify(arr.slice(0,20)));
          // also update single order pointer (preserve clientId if present)
          try {
            const existing = localStorage.getItem('orderDetails');
            if (existing) {
              const exObj = JSON.parse(existing);
              if (exObj.orderId === finalOrder.orderId) {
                localStorage.setItem('orderDetails', JSON.stringify({ ...exObj, ...finalOrder }));
              } else {
                localStorage.setItem('orderDetails', JSON.stringify(finalOrder));
              }
            } else {
              localStorage.setItem('orderDetails', JSON.stringify(finalOrder));
            }
          } catch (e) {
            console.error('Failed to update orderDetails in localStorage', e);
            localStorage.setItem('orderDetails', JSON.stringify(finalOrder));
          }
          // notify other tabs
          try { window.dispatchEvent(new StorageEvent('storage', { key: 'orders', newValue: JSON.stringify(arr) })); } catch {}
        } catch (e) {
          console.error('Failed to sync localStorage', e);
        }
      } else {
        toast.error('Failed to update order');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Chef Dashboard</h1>
        <div className="mb-4">
          <button onClick={fetchOrders} className="px-4 py-2 bg-blue-500 text-white rounded-md">Refresh</button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div>No orders</div>
        ) : (
          <ul className="space-y-4">
            {orders.map(o => (
              <li key={o.orderId} className="p-4 bg-white rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <div className="font-bold">{o.orderId}</div>
                  <div className="text-sm text-gray-500">{o.status} • {new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  {FLOW.map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(o.orderId, s)}
                      className={`px-3 py-2 rounded-md text-sm ${o.status === s ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                    >
                      {s}
                    </button>
                  ))}
                  <button onClick={() => updateStatus(o.orderId, 'cancelled')} className="px-3 py-2 rounded-md bg-red-100 text-red-600">Cancel</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
