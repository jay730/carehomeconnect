
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.4.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client using the anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    // Authenticate the user based on the token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !userData.user) {
      throw new Error("Invalid token or user not found");
    }

    const user = userData.user;

    // Get request body
    const { planId, numberOfBeds, boostEnabled, successUrl, cancelUrl } = await req.json();
    
    // Create line items
    const lineItems = [];

    // Determine pricing based on the plan
    if (planId === 'pro') {
      // Use the specific Stripe Price ID for Pro plan
      lineItems.push({
        price: 'price_1RNYnxIpb6JiWPFAiaqSd2BI',
        quantity: numberOfBeds,
      });
    } else if (planId === 'basic') {
      // Use the specific Stripe Price ID for Starter plan
      lineItems.push({
        price: 'price_1RNYneIpb6JiWPFADhjn8JtB',
        quantity: numberOfBeds,
      });
    } else {
      throw new Error("Invalid plan ID");
    }

    // Add boost if enabled
    if (boostEnabled) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Boost Add-on',
          },
          unit_amount: 4999, // $49.99 in cents
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      });
    }

    // Check if user already exists as a Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: 'subscription',
      success_url: successUrl || `${req.headers.get("origin")}/owner/subscription?success=true`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/owner/subscription?canceled=true`,
      metadata: {
        userId: user.id,
        planId: planId,
        numberOfBeds: numberOfBeds.toString(),
        boostEnabled: boostEnabled ? 'true' : 'false',
      },
    });

    // Return the checkout URL
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
