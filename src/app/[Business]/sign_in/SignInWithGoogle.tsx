"use client"

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useParams, useSearchParams } from "next/navigation";

export function SignInWithGoogle() {
  // const {Business} = useParams();
  // const token = useSearchParams();

  console.log(window.location.href)
  const { signIn } = useAuthActions();
  
  return (
    <Button
      className="flex-1 font-bold font-chakra text-neutral-600"
      variant="outline"
      type="button"
      onClick={() => void signIn("google",{
        redirectTo:`${window.location.href}`
      })}
    >
      <Icons.google className="mr-2 h-4 w-4" /> Google
    </Button>
  );
}
