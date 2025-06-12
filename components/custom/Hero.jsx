"use client";
import { MessageContext } from "@/context/MessageContext";
import { UserContext } from "@/context/UserContext";
import Colors from "@/data/Colors";
import { ArrowRight, Link } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import SigninDialog from "./SigninDialog";
import axios from "axios";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
  "Create a To-Do App in React",
  "Create a Gym Website Dashboard",
  "Create a Blog Website",
  "Create a Portfolio Website",
  "Create a Chat Application",
];

const Hero = () => {
  const inputref = useRef(null);
  const [userInput, setUserInput] = useState("");
  const { message, setMessage } = useContext(MessageContext);
  const { user } = useContext(UserContext);
  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  const onGenerate = async (input) => {
    if (!user?.name) {
      setDialogOpen(true);
      return;
    }
    const msg = {
      role: "user",
      content: input,
    };
    setMessage(msg);
    inputref.current.value = "";
    const response = await axios.post("/api/workspace", {
      email: user.email,
      message: [msg],
    });
    const workspaceId = response.data.id;
    router.push(`/workspace/${workspaceId}`);
  };
  // const sidebarOpen = localStorage.getItem("sidebarOpen");

  return (
    <div className="flex flex-col items-center justify-center ml-[28rem]">
      <div
        className={`w-full flex flex-col items-center justify-center mt-24 gap-2`}
      >
        <h2 className="font-bold text-4xl">What do you want to Build</h2>
        <p className="text-gray-400 font-medium">
          Prompt, Run, Edit and Deploy Full-Stack Web Apps
        </p>
        <div
          className="p-5 border rounded-xl max-w-xl w-full mt-3 bg-white/5"
          style={{ color: Colors.BACKGROUND }}
        >
          <div className="flex gap-2">
            <textarea
              ref={inputref}
              placeholder="What do you want to build"
              className="text-white bg-transparent w-full outline-none h-32 max-h-56 resize-none"
              onChange={(e) => setUserInput(e.target.value)}
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 size-8 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link className="size-5" />
          </div>
        </div>

        <div className="flex flex-wrap max-w-2xl gap-3 justify-center mt-4">
          {SUGGESTIONS.map((suggestion, idx) => (
            <span
              key={idx}
              onClick={() => {
                inputref.current.value = suggestion;
                setUserInput(suggestion);
                onGenerate(suggestion);
              }}
              className="text-white/50 hover:text-white text-sm bg-white/5 border border-white/20 px-4 py-2 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300 ease-in-out"
            >
              {suggestion}
            </span>
          ))}
        </div>

        <SigninDialog
          openDialog={dialogOpen}
          closeDialog={() => setDialogOpen(false)}
        />
      </div>
    </div>
  );
};

export default Hero;
