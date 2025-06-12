import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "../ui/button";
import { MessageCircleCode, X } from "lucide-react";
import WorkspaceDetails from "./WorkspaceDetails";
import SideBarFooter from "./SidebarFooter";

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-2">
          <div className="p-2 flex items-center justify-between">
            <Image src={"/logo.png"} alt="Logo" width={50} height={50} />
            <X className="cursor-pointer"
              width={30}
              height={30}
              onClick={() => {
                toggleSidebar();
                localStorage.setItem("sidebarOpen", "false");
              }}
            />
          </div>
          <Button>
            <MessageCircleCode />
            Start New Chat
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <SidebarGroup>
          <WorkspaceDetails />
        </SidebarGroup>
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
