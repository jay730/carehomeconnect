
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
    // Create Supabase client for auth
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
    
    // Check if user exists as a Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    
    if (customers.data.length === 0) {
      // No subscription found
      return new Response(JSON.stringify({ 
        subscribed: false,
        subscription: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    
    // Get active subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    
    if (subscriptions.data.length === 0) {
      // No active subscription found
      return new Response(JSON.stringify({ 
        subscribed: false,
        subscription: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    const subscription = subscriptions.data[0];
    
    // Get the subscription items to determine plan and add-ons
    const items = await stripe.subscriptionItems.list({
      subscription: subscription.id,
    });
    
    // Determine plan type and whether boost is enabled
    let planId = 'basic';
    let hasBoost = false;
    let numberOfBeds = 1;
    
    for (const item of items.data) {
      const product = await stripe.products.retrieve(item.price.product as string);
      
      if (product.metadata.type === 'plan') {
        planId = product.metadata.plan_id || 'basic';
        
        // Try to get the number of beds from the quantity or metadata
        if (item.quantity) {
          numberOfBeds = item.quantity;
        } else if (product.metadata.beds) {
          numberOfBeds = parseInt(product.metadata.beds, 10);
        }
      } else if (product.metadata.type === 'addon' && product.metadata.name === 'boost') {
        hasBoost = true;
      }
    }
    
    // Return subscription details
    return new Response(JSON.stringify({
      subscribed: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end * 1000, // Convert to milliseconds
        planId,
        hasBoost,
        numberOfBeds
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
