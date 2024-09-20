"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const AlertDemo = () => {
  const error = useSearchParams();
  const err = error.get("error")

  console.log(err);

  return (
    <>
      <div className="py-20">
        <Alert className="mx-auto w-fit [&>svg]:text-neutral-200 bg-rose-50 border-rose-400">
          <Icons.cancel className="h-5 w-5 bg-red-500 p-1 rounded-full" />
          <AlertTitle className="font-chakra text-rose-500 font-bold">
            An error occured
          </AlertTitle>
          <AlertDescription className="text-rose-700">
            {err ? err : `one of the following has occured: you are attempting to login and
            accept invitation using 2 different emails, The token used has either
            expired, does not exist or already used.`}
          </AlertDescription>
        </Alert>

        <p className="mt-10 mx-auto text-center text-blue-400 text-sm">
          <Link href="/">&larr; Back Home</Link>
        </p>
      </div>
    </>
  );
};

export default AlertDemo;
