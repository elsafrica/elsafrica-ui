import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

export const useAuthenticate = (token: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const router = useRouter();
  useEffect(() => {
    if(!token) {
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
    if(!token) {
      router.push('/sign_in');
    } else {
      setIsAuthorized(true);
    }
  }, [token, router]);

  return { isAuthorized };
}
