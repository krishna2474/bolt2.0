import { LogOut } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const SideBarFooter = () => {
  return (
    <div className="p-5 mb-10">
      <div>
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-red-600 transition-all duration-10 ease-in"
        >
          <LogOut />
          <p>Logout</p>
        </Button>
      </div>
    </div>
  );
};

export default SideBarFooter;
