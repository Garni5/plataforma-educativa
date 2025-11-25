/* import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../api/authService";
import type { User } from "../types/auth";

type AuthContextProps = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, url: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar la app, si hay token intenta recuperar el perfil del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authService.getProfile()
        .then(data => setUser(data.data)) // Ajustamos a la estructura { state, data }
        .catch(() => {
          localStorage.removeItem("token");
        }).finally(() => setIsLoading(false));;
    }else{
      setIsLoading(false);
    }
  }, []);


const login = async (username: string, password: string, url: string) => {
  try {
    const { access_token } = await authService.login(username, password, url);

    if (!access_token) {
      return { success: false, message: "No se recibió token del servidor." };
    }

    localStorage.setItem("token", access_token);

    const profile = await authService.getProfile();
    console.log(profile);
    setUser(profile.data);

    return { success: true, message: "Inicio de sesión exitoso." };

  } catch (error: any) {
    console.error("Error al iniciar sesión:", error);
    // Si viene con response del backend
    const message = error.response?.data?.message || "Credenciales incorrectas";
    return { success: false, message };
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout,isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
 */