import Navigation from "@/app/components/navigation";
import { Icons } from "@/components/ui/icons";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-emerald-950 bg-cover items-center justify-between">
      <Navigation />
      <div className="flex flex-col items-center mx-auto my-auto">
        <Icons.logo className="h-52 w-52 text-emerald-800" />
        <h2 className="text-4xl font-sans text-emerald-50 capitalize font-bold">
          Creative <span className="text-emerald-600">next.js</span> template
        </h2>
      </div>
    </main>
  );
}
