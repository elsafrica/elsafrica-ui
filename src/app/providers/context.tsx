'use client'
import socket from '../socket';
import React, { useState, useEffect } from 'react'
import { User } from '../types/data';

interface Context {
  socket: any;
  authToken: string;
  user: User;
  qrCode: string;
  isWAConnected: boolean;
}

interface ContextUpdater {
  updateAuthToken: (token: string) => void,
  updateUser: (user: User) => void,
  updateQRCode: (qr: string) => void,
}

export const Context = React.createContext<Context>({
  socket,
  authToken: '',
  user: {
    id: '',
    email: '',
    phoneNo: '',
  },
  qrCode: '',
  isWAConnected: false,
});
export const ContextUpdater = React.createContext<ContextUpdater>({
  updateAuthToken: (token) => {},
  updateUser: (user) => {},
  updateQRCode: (user) => {},
});

const ContextProvider = ({ children } : { children: React.ReactNode }) => {
  // const [socket, setSocket] = useState<Socket>();
  const storageAuthToken = typeof window !== 'undefined' && localStorage.getItem('authToken');
  const storageQRCode = typeof window !== 'undefined' && localStorage.getItem('qr_code');
  const storageUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}');
  
  const [authToken, setAuthToken] = useState<string>(storageAuthToken || '');
  const [qrCode, setQrCode] = useState<string>(storageQRCode || '')
  const [user, setUser] = useState<User>(storageUser || {
    id: '',
    email: '',
    phoneNo: '',
  });
  const [isWAConnected, setIsWAConnected] = useState<boolean>(false);

  const updateAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token)
  };
  const updateUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };
  const updateQRCode = (qrCode: string) => {
    localStorage.setItem('qr_code', qrCode);
    setQrCode(qrCode);
  };

  useEffect(() => {
    socket?.emit('update_user', user?.id);

    socket.on('get_qr_code', (payload: any) => {
      updateQRCode(payload.qrCode);
    });

    socket.on('wa_client_connected', () => setIsWAConnected(true));

    return () => {
      socket.on('get_qr_code', (payload: any) => {
        updateQRCode(payload.qrCode);
      });
    };
  }, [user]);

  
  return (
    <Context.Provider value={{ socket, authToken, user, qrCode, isWAConnected }}>
      <ContextUpdater.Provider value={{ updateUser, updateAuthToken, updateQRCode }}>
        {children}
      </ContextUpdater.Provider>
    </Context.Provider>
  )
}

export default ContextProvider