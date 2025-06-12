import workspace from "@/app/(main)/workspace/[id]/page";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useSidebar } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

const WorkspaceDetails = () => {
  const [activeTab, setActiveTab] = useState(false);
  // const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [workSpaces, setWorkSpaces] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  useEffect(() => {
    user && getWorkspaces();
  }, [user]);
  const getWorkspaces = async () => {
    try {
      setWorkspaceLoading(true);
      console.log(`/api/workspace/all?email=${user?.email}`);
      const res = await axios.get(`/api/workspace/all?email=${user?.email}`);
      if (res.status === 200) {
        setWorkSpaces(res.data.workspaces);
      } else {
        console.error("Failed to fetch workspaces");
      }
    } catch (error) {
      setWorkSpaces([]);
      toast.error("Failed to fetch workspaces. Please try again.");
    }
    setWorkspaceLoading(false);
  };

  return (
    <div>
      <h2 className="font-medium">Your Chats</h2>
      <div>
        {workspaceLoading
          ? // 🔄 Show 4 skeletons while loading
            Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-7 rounded-md my-3 bg-white/10" />
            ))
          : workSpaces.map((workspace, idx) => (
              <h2
                key={idx}
                onClick={() => {
                  setActiveTab(idx);
                  router.push(`/workspace/${workspace.id}`);
                    toggleSidebar();
                }}
                className={`text-sm ${
                  activeTab == idx ? "bg-white/10 text-white" : ""
                } text-white/70 hover:text-white cursor-pointer hover:bg-white/10 hover:scale-[1.02] transition-all duration-100 ease-in flex flex-col p-2 rounded-md my-3`}
              >
                {workspace?.message[0]?.content}
              </h2>
            ))}
      </div>
    </div>
  );
};

export default WorkspaceDetails;
