"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";

const PaymentTestPage = () => {
  const { isSignedIn, user } = useUser();
  const initOneTimePurchase = useAction(api.payment.paystack.transaction);
  //   const initSubscription = useAction(api.paystack.initializeSubscription);

  const [amount, setAmount] = useState("");
  //   const [productId, setProductId] = useState('');
  const [planId, setPlanId] = useState("");
  const [interval, setInterval] = useState("monthly");

  const handleOneTimePurchase = async () => {
    if (!isSignedIn) {
      toast.error("Error", {
        description: "Please sign in to make a purchase.",
        richColors: true,
      });
      return;
    }

    console.log("----- Got Here -----");

    try {
      console.log("----- Got Here2 -----");
      const authorizationUrl = await initOneTimePurchase({
        userId: user.id,
        amount: parseFloat(amount),
        email: user.primaryEmailAddress!.emailAddress,
      });
      window.location.href = authorizationUrl;
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        richColors: true,
        description: "Failed to initialize purchase.",
      });
    }
  };

  //   const handleSubscription = async () => {
  //     if (!isSignedIn) {
  //       toast.error("Error", { richColors: true, description: "Please sign in to subscribe." });
  //       return;
  //     }

  //     try {
  //       const authorizationUrl = await initSubscription({
  //         userId: user.id,
  //         amount: parseFloat(amount) * 100, // Convert to lowest currency unit
  //         email: user.primaryEmailAddress!.emailAddress,
  //         planId,
  //         currency: "USD",
  //         interval,
  //       });
  //       window.location.href = authorizationUrl;
  //     } catch (error) {
  //       toast.error("Error",{ description: "Failed to initialize subscription.", richColors: true });
  //     }
  //   };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Test Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>One-Time Purchase</CardTitle>
            <CardDescription>Test a single payment transaction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="productId">Product ID</Label>
              <Input
                id="productId"
                value={productId}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setProductId(e.target.value)}
                placeholder="Enter product ID"
              />
            </div> */}
          </CardContent>
          <CardFooter>
            <Button onClick={handleOneTimePurchase} className="w-full">
              Make Purchase
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Test a subscription payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subAmount">Amount (USD)</Label>
              <Input
                id="subAmount"
                type="number"
                value={amount}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planId">Plan ID</Label>
              <Input
                id="planId"
                value={planId}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setPlanId(e.target.value)}
                placeholder="Enter plan ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Interval</Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Start Subscription</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentTestPage;
