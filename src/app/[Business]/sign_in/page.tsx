import { SignInWithOAuth } from "./SignInWithOAuth";

export default function SignInFormEmailCode() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="max-w-[384px] h-fit rounded-lg p-4 py-8 border border-zinc-200 flex flex-col gap-4">
        {/* {step === "signIn" ? ( */}
          <>
            <h2 className="font-semibold font-chakra text-xl tracking-tight">
              Sign in or create an account
            </h2>
            <SignInWithOAuth />
            {/* <SignInMethodDivider /> */}
            {/* <SignInWithEmailCode
              handleCodeSent={(email) => setStep({ email })}
            /> */}
          </>
        {/* ) : (
          <>
            <h2 className="font-semibold text-2xl tracking-tight">
              Check your email
            </h2>
            <p className="text-muted-foreground text-sm">
              Enter the 8-digit code we sent to your email address.
            </p>
            <form
              className="flex flex-col"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitting(true);
                const formData = new FormData(event.currentTarget);
                signIn("resend-otp", formData).catch(() => {
                  toast.error("Code could not be verified, try again", {
                    richColors: true,
                  });
                  setSubmitting(false);
                });
              }}
            >
              <label htmlFor="code" className="text-xs font-bold text-neutral-500">Code</label>
              <CodeInput />
              <input name="email" value={step.email} type="hidden" />
              <Button type="submit" disabled={submitting}>
                Continue
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => setStep("signIn")}
              >
                Cancel
              </Button>
            </form>
          </>
        )} */}
      </div>
    </div>
  );
}
