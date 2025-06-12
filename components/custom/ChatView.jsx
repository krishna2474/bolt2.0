"use client";
import { MessageContext } from "@/context/MessageContext";
import { UserContext } from "@/context/UserContext";
import Colors from "@/data/Colors";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../ui/sidebar";

const ChatView = () => {
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { message, setMessage } = useContext(MessageContext);
  const { user, setUser } = useContext(UserContext);
  const { id } = useParams();
  const [userInput, setUserInput] = useState("");
  const lastProcessedIndex = useRef(-1); // tracks last AI-handled message
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);
  useEffect(() => {
    getWorkspaceData();
  }, [id]);

  const getWorkspaceData = async () => {
    try {
      const response = await axios.get(`/api/workspace?id=${id}`);
      if (response.status == 200) {
        setMessage(response.data.message);
      } else {
        console.error("Failed to fetch workspace data");
      }
    } catch (error) {
      toast.error("Failed to fetch workspace data. Please try again.");
    }
  };

  useEffect(() => {
    if (message && message.length > 0) {
      const lastIndex = message.length - 1;
      const lastMessage = message[lastIndex];
      if (
        lastMessage.role === "user" &&
        lastProcessedIndex.current !== lastIndex
      ) {
        lastProcessedIndex.current = lastIndex;

        getAiResponse();
      }
    }
  }, [message]);

  const getAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(message) + Prompt.CHAT_PROMPT;

    const response = await axios.post("/api/ai-chat", {
      prompt: PROMPT,
    });

    const aiResp = { role: "ai", content: response.data.result };

    setMessage((prevMessages) => [...prevMessages, aiResp]);
    console.log(id, "ID from ChatView");
    await axios.patch(`/api/workspace`, {
      id,
      message: [...message, aiResp],
    });

    setLoading(false);
  };

  const onGenerate = async (input) => {
    setMessage((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);
    inputRef.current.value = "";
  };

  return (
    <div className="relative pr-20  h-[89vh] flex flex-col">
      <div className="pl-10  flex-1 overflow-y-scroll scrollbar-hide">
        {Array.isArray(message) &&
          message.map((msg, index) => (
            <div
              key={index}
              className="leading-7 p-3 rounded-lg mb-2 bg-[#181818] flex gap-2"
            >
              {msg?.role === "user" && (
                <div className="self-end">
                  <Image
                    src={user?.picture}
                    alt="User Image"
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                </div>
              )}

              <div className="flex flex-col overflow-auto break-words whitespace-pre-wrap max-w-full">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}

        {/* loader shown after all messages */}
        {loading && (
          <div className="p-3 rounded-lg mb-2 bg-gray-400/30 flex gap-2 items-center">
            <Loader2Icon className="animate-spin" />
            <span>Generating Response...</span>
          </div>
        )}
      </div>
      {/* Input */}
      <div className="flex gap-2 items-end w-full">
        <Image
          onClick={() => toggleSidebar()}
          src={user?.picture}
          alt="user"
          className="rounded-full cursor-pointer"
          width={30}
          height={30}
        />
        <div
          className="p-5 border rounded-xl w-full mt-3 bg-white/5"
          style={{ color: Colors.BACKGROUND }}
        >
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
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
      </div>
    </div>
  );
};

export default ChatView;
