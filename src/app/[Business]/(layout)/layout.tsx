"use client";

import { Separator } from "@/components/ui/separator";
import { Nav } from "../components/nav";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { ReactElement } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { redirect, useParams } from "next/navigation";
import { isErrorResponse } from "@/app/components/checkError";
import Loader from "@/app/components/loader";
import useAuthRedirect from "@/app/components/isAuthenticated";

const Layout = ({ children }: { children: ReactElement }) => {

  useAuthRedirect()
  const { Business } = useParams();

  const getUserRole = useQuery(
    api.Organisation.OrganisationToUser.getUserRole,
    {
      subDomain: Business as unknown as string,
    }
  );

  if (isErrorResponse(getUserRole)) {
    redirect(`/error?error=${getUserRole?.error}`);
  }

  if (getUserRole === null) {
    redirect("/error");
  }

  if (!getUserRole)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <div className="max-h-screen overflow-hidden bg-slate-50 h-screen w-full p-2 hidden md:flex justify-between">
      <div className="h-full rounded-lg w-[15%] bg-slate-100 border border-slate-200 flex flex-col p-2">
        <div className={cn("flex h-[52px] items-center justify-center")}>
          {/* <OrganizationSwitcher/> */}
        </div>
        <Separator className="mt-4" />
        <Nav
          className="mt-4"
          links={[
            {
              title: "Add Staff",
              label: "",
              link: "invite-staff",
              icon: <Icons.plus className="mr-2 h-4 w-4" />,
              variant: "ghost",
            },
            {
              title: "Stats",
              label: "",
              link: "",
              icon: <Icons.chart className="mr-2 h-4 w-4" />,
              variant: "default",
            },
            {
              title: "Staff",
              label: "",
              link: "staff",
              icon: <Icons.users className="mr-2 h-4 w-4" />,
              variant: "default",
            },
          ]}
        />
        <Separator className="mt-4" />
        <Nav
          className="mt-4"
          links={[
            {
              title: "setting",
              label: "",
              link: "settings",
              icon: <Icons.settings className="mr-2 h-4 w-4" />,
              variant: "ghost",
            },
          ]}
        />
      </div>
      <div className="w-5/6 h-full">
        <ScrollArea className="w-full px-6 pt-6 h-full">{children}</ScrollArea>
      </div>
    </div>
  );
};

export default Layout;
