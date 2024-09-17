"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { redirect, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import Loader from "@/app/components/loader";

const AcceptBusinessInvitation = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (token === null) {
    redirect("/test/invalid-invitation");
  }

  const invitation = useQuery(
    api.Businesses.businessInvitation.getInvitationByToken,
    { token: token as string }
  );

  if (invitation === null) {
    redirect("/test/invalid-invitation");
  }

  const acceptInvitation = useMutation(
    api.Businesses.businessInvitation.acceptInvitation
  );

  const generateUploadUrl = useMutation(
    api.Businesses.businessInvitation.generateBusinessUploadUrl
  );

  const [formData, setFormData] = useState({
    name: "",
    photo: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeletePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formData.photo) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": formData.photo.type },
          body: formData.photo,
        });
        const { storageId } = await result.json();

        await acceptInvitation({
          token: token as string,
          adminName: formData.name,
          image: storageId,
        });
      } else {
        await acceptInvitation({
          token: token as string,
          adminName: formData.name,
        });
      }

      toast.success("Invitation accepted successfully!", {
        richColors: true,
      });
      redirect("/");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation. Please try again.", {
        richColors: true,
      });
    }
  };

  if (!invitation)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <>
      <div className="py-14 h-full w-full">
        <Card className="w-1/3 mx-auto">
          <CardHeader>
            <CardTitle>Accept Invitation</CardTitle>
            <CardDescription>
              You&rsquo;ve been invited to join {invitation?.businessName} on
              our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label
                    htmlFor="photo"
                    className="text-xs font-bold text-neutral-500"
                  >
                    Business logo
                  </Label>
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
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
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
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-xs font-bold text-neutral-500"
                  >
                    Your Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
              </div>
              <Button className="mt-6 w-full" type="submit">
                Accept Invitation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AcceptBusinessInvitation;
