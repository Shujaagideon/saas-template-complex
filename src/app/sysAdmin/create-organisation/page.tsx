"use client"

import React, { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import TopNav from "../components/topNav";
import { toast } from "sonner";
import Loader from "@/app/components/loader";

const formSchema = z.object({
  organisationName: z.string().min(2, {
    message: "Organisation name must be at least 2 characters.",
  }),
  organisationDomain: z.string().min(2, {
    message: "Organisation domain must be at least 2 characters.",
  }),
  adminEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function SystemAdminDashboard() {
  const createInvitation = useAction(api.Organisation.sendOrganisationInvitation.createOrgInvitation);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organisationName: "",
      organisationDomain: "",
      adminEmail: "",
    },
  });

  const organisationName = useWatch({
    control: form.control,
    name: "organisationName",
  });

  useEffect(() => {
    form.setValue("organisationDomain", organisationName.toLowerCase());
  }, [organisationName, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await createInvitation({
        organisationDomain: values.organisationDomain,
        organisationName: values.organisationName,
        email: values.adminEmail
      });
      form.reset();
      toast.success("Organisation created successfully!", {
        richColors: true,
      });
    } catch (error) {
      let err = error as {data: string}
      toast.error("Failed to create organisation.", {
        description: err.data,
        richColors: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <TopNav text="New Organisation"/>

      <Card className="">
        <CardHeader>
          <CardTitle>Create New Organisation</CardTitle>
          <CardDescription>
            Enter the details for the new organisation and admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="organisationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter organisation name" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400"/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organisationDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation Domain</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter organisation domain" 
                          {...field} 
                          disabled 
                          className="bg-gray-100"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400"/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter admin email" type="email" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400"/>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="animate-pulse flex justify-center items-center">
                    <Loader mr="mr-2" className="h-4 w-4" />
                    Creating...
                  </div>
                ) : (
                  'Create Organisation'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}