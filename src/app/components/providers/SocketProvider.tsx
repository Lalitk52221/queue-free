'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    let socketInstance: Socket | null = null;

    async function connect() {
      const { io } = await import('socket.io-client');
      socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
      });

      socketInstance.on('connect', () => {
        if (!mounted) return;
        setIsConnected(true);
        // eslint-disable-next-line no-console
        console.log('Socket connected:', socketInstance?.id);
      });

      socketInstance.on('disconnect', () => {
        if (!mounted) return;
        setIsConnected(false);
        // eslint-disable-next-line no-console
        console.log('Socket disconnected');
      });

      if (mounted) setSocket(socketInstance);
    }

    connect();

    return () => {
      mounted = false;
      if (socketInstance) {
        socketInstance.disconnect();
      }
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}