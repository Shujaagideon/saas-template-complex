import { Separator } from "@/components/ui/separator";
import { Nav } from "../components/nav";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { ReactElement } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const layout = ({ children }: { children: ReactElement }) => {
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
              title: "New Business",
              label: "",
              link: "test/create-business",
              icon: <Icons.plus className="mr-2 h-4 w-4" />,
              variant: "ghost",
            },
            {
              title: "Stats",
              label: "",
              link: "test",
              icon: <Icons.chart className="mr-2 h-4 w-4" />,
              variant: "default",
            },
            // {
            //   title: "Previous",
            //   label: "10",
            //   link: "generate/chats",
            //   icon: <Icons.list className="mr-2 h-4 w-4" />,
            //   variant: "ghost",
            // },
            // {
            //   title: "Archive",
            //   label: "",
            //   link: "generate/archive",
            //   icon: <Icons.archive className="mr-2 h-4 w-4" />,
            //   variant: "ghost",
            // },
          ]}
        />
        <Separator className="mt-4" />
        <Nav
          className="mt-4"
          links={[
            {
              title: "setting",
              label: "",
              link: "sysAdmin/settings",
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

export default layout;
