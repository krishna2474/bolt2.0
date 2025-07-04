import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import React from "react";

const workspace = () => {
  return (
    <div className="p-3 pr-5 mt-5">
      <div className="gap-10 grid grid-cols-1 md:grid-cols-3">
          <ChatView />
        <div className="col-span-2">
          <CodeView />
        </div>
      </div>
    </div>
  );
};

export default workspace;
