import Image from "next/image";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { UserContext } from "@/context/UserContext";
import SigninDialog from "./SigninDialog";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <div className="p-4 flex justify-between items-center">
      <Image src={"/logo.png"} alt="Logo" width={70} height={70} />
      {!user?.name && (
        <div className="gap-5 flex">
          <Button variant="secondary">Sign in</Button>
          <Button
            className="text-white"
            onClick={() => {
              setDialogOpen(true);
            }}
            style={{
              backgroundColor: Colors.BLUE,
            }}
          >
            Get Started
          </Button>
        </div>
      )}

      <SigninDialog
        openDialog={dialogOpen}
        closeDialog={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default Header;
