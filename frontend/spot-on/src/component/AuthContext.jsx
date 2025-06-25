import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
        fetch("http://localhost:3000/auth/me", {
            credentials: "include",
          })
            .then(res => res.json())
            .then(data => {
              if (data.user) setUser(data.user);
            }).catch(setUser(null)).finally(() => setLoading(false));
    } catch (error) {
        throw new Error(error);
    }
  }, []);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.user) setUser(data.user);
    return data;
  };

  const signUp = async (username, email, password) => {
    const res = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),

    });
    const data = await res.json();
    if (data.user) setUser(data.user);
    return data;
  }

  const logout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp,logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
};
