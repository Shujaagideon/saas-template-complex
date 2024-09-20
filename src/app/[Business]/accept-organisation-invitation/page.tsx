"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  redirect,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import Loader from "@/app/components/loader";
import { isErrorResponse } from "@/app/components/checkError";
import useAuthRedirect from "@/app/components/isAuthenticated";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  photo: z.any().optional(),
});

const AcceptBusinessInvitation = () => {
  useAuthRedirect();

  const router = useRouter();

  const { Business } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (token === null) {
    redirect("/error");
  }

  const invitation = useQuery(
    api.Organisation.organisationInvitation.getInvitationByToken,
    { token: token as string }
  );

  if (isErrorResponse(invitation)) {
    redirect(`/error?error=${invitation?.error}`);
  }

  if (invitation === null) {
    redirect("/error");
  }

  const acceptInvitation = useMutation(
    api.Organisation.organisationInvitation.acceptInvitation
  );

  const generateUploadUrl = useMutation(
    api.Organisation.organisationInvitation.generateOrganisationUploadUrl
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      photo: null,
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeletePhoto = () => {
    form.setValue("photo", null);
    setPreviewUrl(null);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (values.photo !== null) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": values.photo.type },
          body: values.photo,
        });
        const { storageId } = await result.json();

        let res = await acceptInvitation({
          token: token as string,
          adminName: values.name,
          image: storageId,
          organisationDomain: Business as unknown as string,
        });
        if (res) {
          window.location.href = "/"; // Changed this line
        }
      } else {
        let res = await acceptInvitation({
          token: token as string,
          adminName: values.name,
          organisationDomain: Business as unknown as string,
        });
        if (res) {
          window.location.href = "/"; // Changed this line
        }
      }
      toast.success("Invitation accepted successfully!", {
        richColors: true,
      });
    } catch (error) {
      console.log(error);
      let err = error as { error: string };
      toast.error("Failed to accept invitation. Please try again.", {
        description: err.error,
        richColors: true,
      });
    } finally {
      console.log("finally");
      setIsSubmitting(false);
    }
    // redirect("/");
  };

  if (!invitation)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <div className="py-14 h-full w-full">
      <Card className="w-1/3 mx-auto">
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>
            You&rsquo;ve been invited to join {invitation?.organisationName} on
            our platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="photo"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-neutral-500">
                      Business logo
                    </FormLabel>
                    <FormControl>
                      {previewUrl ? (
                        <div className="relative w-full h-48">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleDeletePhoto}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Icons.cancel size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 py-8 text-center cursor-pointer">
                          <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="photo"
                            className="cursor-pointer text-xs font-bold text-neutral-500"
                          >
                            Choose a photo
                          </label>
                        </div>
                      )}
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-neutral-500">
                      Your Name <span className="text-rose-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400" />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="animate-pulse flex justify-center items-center">
                    <Loader mr="mr-2" className="h-4 w-4" />
                    Accepting...
                  </div>
                ) : (
                  "Accept Invitation"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptBusinessInvitation;
