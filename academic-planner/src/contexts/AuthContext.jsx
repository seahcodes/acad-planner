import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password, role) => {
    // Demo users
    if (
      email === "student@demo.com" &&
      password === "demo123" &&
      role === "student"
    ) {
      const userData = {
        name: "Shruti", // 👈 add this
        email,
        role,
        course: "B.Tech CSE",
        semester: 4,
        institution: "Your College",
      };

      setUser(userData);
      return { success: true };
    }

    if (
      email === "admin@demo.com" &&
      password === "demo123" &&
      role === "admin"
    ) {
      const userData = {
        name: "Admin",
        email,
        role,
      };

      setUser(userData);
      return { success: true };
    }

    return { success: false, error: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}