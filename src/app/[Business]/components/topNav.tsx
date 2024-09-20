import UseAvatar from "@/app/components/avatar";

const TopNav = ({ text }: {text: string}) => {
  return (
    <>
      <div className="px-4 flex justify-between top-0 bg-neutral-50 sticky">
        <h1 className="text-xl text-neutral-400 font-bold font-chakra mb-8">
          {text}
        </h1>

        <UseAvatar url=""/>
      </div>
    </>
  );
};

export default TopNav;
