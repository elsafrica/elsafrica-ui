import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string) : { isExpired: boolean, isSuperUser: boolean, isSubSuperUser?: boolean } => {
  try {
    const decode: { id: string, userType: string, exp: number } = jwtDecode(token);
    const isExpired = Date.now() / 1000 > decode.exp;
    const isSuperUser = decode.userType === 'super';
    const isSubSuperUser = decode.userType === 'subsuper';

    if (isSuperUser) {
      return({
        isSuperUser,
        isSubSuperUser: true,
        isExpired,
      });
    }

    if (isSubSuperUser) {
      return({
        isSuperUser: false,
        isSubSuperUser,
        isExpired,
      });
    }

    return {
      isExpired,
      isSuperUser
    };
  } catch (error) {
    if(error instanceof Error) {
      return {
        isExpired: true,
        isSuperUser: false
      };
    }
  }

  return {
    isExpired: true,
    isSuperUser: false
  };
};