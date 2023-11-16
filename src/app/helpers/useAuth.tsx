import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { decodeToken } from '../utils/jwt';

export const useAuthenticate = (token: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const router = useRouter();
  useEffect(() => {
    if(!token || decodeToken(token).isExpired) {
      console.log('pushing');
      
      router.push('/sign_in');
    } else {
      setIsAuthenticated(true);
    }
  }, [token, router]);

  return { isAuthenticated };
}

export const useAuthorize = (token: string) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>();
  const router = useRouter();
  useEffect(() => {
    if(!token || decodeToken(token).isExpired || !decodeToken(token).isSuperUser) {
      router.push('/customers/new');
    } else {
      setIsAuthorized(true);
    }
  }, [token, router]);

  return { isAuthorized };
}
