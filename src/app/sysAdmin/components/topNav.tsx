import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";

const TopNav = ({ text }: {text: string}) => {
  return (
    <>
      <div className="px-4 flex justify-between top-0 bg-neutral-50 sticky">
        <h1 className="text-xl text-neutral-400 font-bold font-chakra mb-8">
          {text}
        </h1>

        <Avatar className="h-6 w-6">
          <AvatarImage src="https://github.com/shadcn.pn" />
          <AvatarFallback className="bg-neutral-300">
            <Icons.avatar className="h-3 w-3 text-neutral-600"/>
          </AvatarFallback>
        </Avatar>
      </div>
    </>
  );
};

export default TopNav;
