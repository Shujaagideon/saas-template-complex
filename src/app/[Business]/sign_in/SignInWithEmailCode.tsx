import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInWithEmailCode({
  handleCodeSent,
  provider,
  children,
}: {
  handleCodeSent: (email: string) => void;
  provider?: string;
  children?: React.ReactNode;
}) {
  const { signIn } = useAuthActions();
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        signIn(provider ?? "resend-otp", formData)
          .then(() => handleCodeSent(formData.get("email") as string))
          .catch((error) => {
            console.error(error);
            toast.error( "Could not send code",{
              richColors: true,
            });
            setSubmitting(false);
          });
      }}
    >
      <label htmlFor="email" className="text-xs ml-2 mb-2 font-bold text-neutral-500">Email</label>
      <Input name="email" id="email" className="mb-4" autoComplete="email" />
      {children}
      <Button type="submit" disabled={submitting}>
        Send code
      </Button>
    </form>
  );
}