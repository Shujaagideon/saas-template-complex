// convex/paystack.ts

import { v } from "convex/values";
import {
  action,
  httpAction,
  internalAction,
  internalMutation,
  mutation,
} from "../_generated/server";
import { api } from "../_generated/api";

interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    customer: {
      email: string;
    };
    plan: {
      id: number;
      name: string;
      amount: number;
      interval: string;
    };
    metadata: {
      productId?: string;
      planId?: string;
    };
  };
}

const verifyPaystackTransaction = async (
  reference: string
): Promise<PaystackVerificationResponse> => {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to verify Paystack transaction");
  }

  return response.json();
};

// End point for creating a customer in paystack
export const createCustomer = internalAction({
  handler: async (ctx) => {
    const resp = await fetch("https://api.paystack.co/customer", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: (await ctx.auth.getUserIdentity())?.email,
      }),
    });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    return await resp.json();
  },
});

// End point for creating a customer in paystack
export const createCustomerInDB = internalMutation({
  args: {
    code: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { code, email }) => {
    ctx.db.insert("customer", {
      code,
      email,
    });
  },
});

// End point for creating a customer in paystack
export const customer = mutation({
  args: {
    code: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { code, email }) => {
    ctx.db.insert("customer", {
      code,
      email,
    });
  },
});

// End point for initiating a customer transaction.
export const transaction = action({
  args: {
    amount: v.number(),
    email: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: await JSON.stringify({
        email: args.email,
        amount: args.amount,
        // callback_url:'https://zealous-finch-82.convex.site/transactionUpdate'
        callback_url: "http://localhost:3000",
      }),
    };

    const resp = await fetch(
      "https://api.paystack.co/transaction/initialize",
      options
    );

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    let res = await resp.json();

    let url = res.data.authorization_url;

    // Store the transaction in the database
    await ctx.runMutation(api.payment.payment_db.createTransaction, {
      userId: args.userId,
      type: "one-time",
      email: args.email,
      amount: args.amount,
      currency: "USD",
      paystackReference: res.data.reference,
      status: "pending",
    });

    return url;
  },
});

// End point for updating a customer transaction from paystack webhook. Make sure to set it up as a webhook in paystack
export const transactionUpdate = httpAction(async (ctx, req) => {
  // Verify that the request is coming from Paystack
  const paystackSignature = req.headers.get("x-paystack-signature");
  // You should implement a verification of the signature here

  // Parse the webhook payload
  const body = await req.json();
  const event = body as {
    event: string;
    data: PaystackVerificationResponse["data"];
  };

  console.log(event)

  if (event.event === "charge.success") {
    const verificationResponse = await verifyPaystackTransaction(
      event.data.reference
    );
    if (verificationResponse.data.status === "success") {
      // Update the transaction status
      await ctx.runMutation(api.payment.payment_db.updateTransactionStatus, {
        paystackReference: event.data.reference,
        status: "completed",
      });

      // If it's a subscription, create or update the subscription record
      if (verificationResponse.data.plan) {
        await ctx.runMutation(api.payment.payment_db.createSubscription, {
          userId: verificationResponse.data.customer.email, // You might want to fetch the actual userId based on the email
          planId: verificationResponse.data.plan.id.toString(),
          amount: verificationResponse.data.plan.amount / 100, // Convert from kobo to main currency unit
          currency: "NGN", // Assuming Nigerian Naira, adjust as needed
          interval: verificationResponse.data.plan.interval as
            | "daily"
            | "weekly"
            | "monthly"
            | "yearly",
          paystackCustomerCode: verificationResponse.data.customer.email, // You might want to store the actual customer code
          paystackSubscriptionCode: event.data.reference,
        });
      }
    }
  } else if (event.event === "subscription.disable") {
    // Handle subscription cancellation
    await ctx.runMutation(api.payment.payment_db.updateSubscriptionStatus, {
      paystackSubscriptionCode: event.data.reference,
      status: "canceled",
    });
  }

  // Return a response to Paystack
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
