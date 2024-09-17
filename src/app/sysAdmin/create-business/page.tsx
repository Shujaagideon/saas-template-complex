"use client";

import React, { FormEvent, FormEventHandler, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TopNav from "../components/topNav";
import { toast } from "sonner";

export default function SystemAdminDashboard() {
  const createBusiness = useMutation(
    api.systemAdmin.sysAdmin.createBusinessWithAdmin
  );
  const createInvitation = useAction(api.Businesses.sendbusinessInvitation.createBusinessInvitation);

  const [formData, setFormData] = useState({
    businessName: "",
    businessDomain: "",
    adminEmail: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createInvitation({
        businessDomain: formData.businessDomain,
        businessName:formData.businessName,
        email: formData.adminEmail
      });
      setFormData({
        businessName: "",
        businessDomain: "",
        adminEmail: "",
      });
      toast.success("Business created successfully!",{
        richColors: true,
      });
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error("Failed to create business. Please try again.",{
        richColors: true,
      });
    }
  };

  return (
    <div className="w-full mx-auto">
      <TopNav text="New Business"/>

      <Card className="">
        <CardHeader>
          <CardTitle>Create New Business</CardTitle>
          <CardDescription>
            Enter the details for the new business and admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter business name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessDomain">Business Domain</Label>
                <Input
                  id="businessDomain"
                  name="businessDomain"
                  value={formData.businessDomain}
                  onChange={handleInputChange}
                  placeholder="Enter business domain"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  placeholder="Enter admin email"
                  type="email"
                  required
                />
              </div>
            </div>
            <Button type="submit">Create Business</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
