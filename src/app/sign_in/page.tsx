"use client";

import { SignInWithOAuth } from "./SignInWithOAuth";
import { useParams } from "next/navigation";

export default function SignInFormEmailCode() {
  const {Business} = useParams();
  console.log(Business)
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="max-w-[384px] h-fit rounded-lg p-4 py-8 border border-zinc-200 flex flex-col gap-4">
          <>
            <h2 className="font-semibold font-chakra text-xl tracking-tight">
              Sign in or create an account
            </h2>
            <SignInWithOAuth />
          </>
      </div>
    </div>
  );
}
