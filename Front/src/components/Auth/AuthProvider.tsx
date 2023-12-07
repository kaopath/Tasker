import axios from "axios";
import { AuthenticatedUserDto } from "../../models/user";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

interface AuthContextType {
  userToken: AuthenticatedUserDto | null;
  setUserToken: (newUserToken: AuthenticatedUserDto | null) => void;
  }

const AuthContext = createContext<AuthContextType>({
    userToken: null,
    setUserToken: () => {},
  });

interface AuthProviderProps {
    children: ReactNode;
  }

const AuthProvider = ({ children }: AuthProviderProps) => {
  const localToken = localStorage.getItem("user");
  const [userToken, setUserToken_] = useState<AuthenticatedUserDto | null>(localToken ? JSON.parse(localToken): null);

  // Function to set the authentication token
  const setUserToken = (newUserToken: AuthenticatedUserDto | null) => {
    setUserToken_(newUserToken);
  };

  useEffect(() => {
    if (userToken) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + userToken.token;
      localStorage.setItem('user', JSON.stringify(userToken));
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('user')
    }
  }, [userToken]);

  const contextValue = useMemo(
    () => ({
      userToken,
      setUserToken,
    }),
    [userToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;