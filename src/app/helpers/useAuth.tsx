import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { decodeToken } from '../utils/jwt';

export const useAuthenticate = (token: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const router = useRouter();
  useEffect(() => {
    if(!token || decodeToken(token).isExpired) {      
      router.push('/auth/sign_in');
    } else {
      setIsAuthenticated(true);
    }
  }, [token, router]);

  return { isAuthenticated };
}

export const useAuthorize = (token: string) => {
  const [isAuthorized, setIsAuthorized] = useState<{
    isSuperUser?: boolean,
    isSubSuperUser?: boolean,
  }>({
    isSuperUser: false,
    isSubSuperUser: false,
  });
  const router = useRouter();
  useEffect(() => {
    const decoded = decodeToken(token);
    if(!token || decoded.isExpired) {
      router.push('/customers/new');
    }

    if (decoded.isSubSuperUser) {
      router.push('/customers/list');

      return setIsAuthorized({
        isSubSuperUser: decoded.isSubSuperUser,
        isSuperUser: decoded.isSuperUser
      });
    } else {
      setIsAuthorized({
        isSubSuperUser: decoded.isSubSuperUser,
        isSuperUser: decoded.isSuperUser
      });
    }
  }, [token, router]);

  return isAuthorized;
}
