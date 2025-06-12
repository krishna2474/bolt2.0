"use client";
import Lookup from "@/data/Lookup";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MessageContext } from "@/context/MessageContext";
import Prompt from "@/data/Prompt";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
const CodeView = () => {
  const { id } = useParams();
  const [files, setFiles] = useState(null);
  const [activeTab, setActiveTab] = useState("code");
  const { message, setMessage } = useContext(MessageContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (message.length > 0) {
      const role = message[message.length - 1]?.role;

      if (role == "user") generateAiCode();
    }
  }, [message]);

  useEffect(() => {
    id && getWorkspaceData();
  }, []);
  const getWorkspaceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/get-files?id=${id}`);
      if (response.status === 200) {
        const files = {
          ...Lookup.DEFAULT_FILE,
          ...response.data.fileData,
        };
        setFiles(files);
      } else {
        setFiles(Lookup.DEFAULT_FILE); // fallback
      }
    } catch (err) {
      console.error("Failed to fetch workspace data", err);
      setFiles(Lookup.DEFAULT_FILE); // fallback
    }
    setLoading(false);
  };

  const generateAiCode = async () => {
    setLoading(true);
    const prompt = JSON.stringify(message) + " " + Prompt.CODE_GEN_PROMPT;
    const response = await axios.post("/api/gen-ai", { prompt });
    console.log(response.data);
    const aiResp = response.data;
    const mergedFiles = { ...aiResp?.files };
    setFiles(mergedFiles);
    setLoading(false);
    const res = axios.post("/api/update-code", {
      id: id,
      files: mergedFiles,
    });
  };

  return (
    <div>
      <div className="bg-[#181818] w-full p-2 border pr-10">
        <div className="flex justify-center items-center flex-wrap shrink-0 bg-black p-2 w-[140px] gap-3 rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab == "code" && "text-blue-500 bg-blue-500/25 rounded-full p-1 px-2 transition-all duration-50 ease-in-out"}`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab == "preview" && "text-blue-500 bg-blue-500/25 rounded-full p-1 px-2 transition-all duration-200 ease-in-out"}`}
          >
            Preview
          </h2>
        </div>
      </div>
      <div className="rounded-xl relative h-[80vh] w-full">
        <SandpackProvider
          className=""
          files={files}
          customSetup={{ dependencies: { ...Lookup.DEPENDENCY } }}
          template="react"
          theme="dark"
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            autoReload: true,
          }}
        >
          <SandpackLayout>
            <SandpackFileExplorer style={{ height: "80vh" }} />
            {activeTab === "code" && (
              <SandpackCodeEditor style={{ height: "80vh" }} />
            )}
            {activeTab === "preview" && (
              <SandpackPreview
                style={{ height: "80vh" }}
                showNavigator={true}
              />
            )}
          </SandpackLayout>
        </SandpackProvider>

        {loading && (
          <div className="absolute inset-0 z-10 flex justify-center items-center bg-black opacity-90 text-white">
            <Loader2Icon className="animate-spin w-10 h-10 mr-2" />
            Generating Code...
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeView;
