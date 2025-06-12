"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "../components/custom/Header";
import { MessageContext } from "@/context/MessageContext";
import { UserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import Preloader from "@/components/custom/Preloader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AppSideBar";

export function ThemeProvider({ children, ...props }) {
  const [message, setMessage] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      localStorage.setItem("hasVisited", "true");
      setShowPreloader(true);

      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      setShowPreloader(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return;

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        const response = await axios.get(`/api/user?email=${parsedUser.email}`);

        if (response.status === 200 && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoadingUser(false);
      }
    };

    checkAuth();
    const timer = setTimeout(() => setShowPreloader(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const shouldDelayRender = loadingUser || showPreloader;
  if (shouldDelayRender) return <Preloader />;

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}
    >
      <UserContext.Provider value={{ user, setUser }}>
        <MessageContext.Provider value={{ message, setMessage }}>
          <NextThemesProvider {...props}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <div className="flex flex-1">
                {/* <SidebarProvider defaultOpen={true}> */}
                  {/* <AppSidebar className=""/> */}
                {/* </SidebarProvider> */}
                <main className="flex  flex-col items-center justify-center gap-4 p-4">
                  {children}
                </main>
              </div>
            </div>
          </NextThemesProvider>
        </MessageContext.Provider>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
}
