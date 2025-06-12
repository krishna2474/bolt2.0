"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { toast } from "sonner";

const SigninDialog = ({ openDialog, closeDialog }) => {
  const { setUser } = useContext(UserContext);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse?.access_token}`,
            },
          }
        );

        const response = await axios.post("/api/user/create", {
          name: userInfo.data.name,
          email: userInfo.data.email,
          picture: userInfo.data.picture,
          sub: userInfo.data.sub,
        });

        if (response.status === 200) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          toast.success(`Welcome, ${response.data.user.name}!`);
          closeDialog(false);
        } else {
          toast.error("Failed to create or log in user.");
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        toast.error("Login failed. Try again.");
      }
    },
    onError: (error) => {
      console.error("Google login error", error);
      toast.error("Google Sign-in failed.");
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent className="max-w-xl text-center">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl pt-8 font-bold text-center">
            Continue with Bolt 2.0
          </DialogTitle>
          <DialogDescription className="text-white/50 mt-2 text-center">
            Log into your existing account or create a new one to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center my-6">
          <Button
            onClick={() => googleLogin()}
            style={{ backgroundColor: Colors.BLUE }}
            className="text-white px-6 py-3 text-lg hover:opacity-90 transition"
          >
            Sign in with Google
          </Button>
        </div>

        <DialogDescription className="text-white/50 pb-8 text-sm text-center">
          By using Bolt 2.0, you agree to data collection for usage and
          analytics.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default SigninDialog;
