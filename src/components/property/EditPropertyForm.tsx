
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  capacity: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

interface EditPropertyFormProps {
  property: Property;
  onSave: (updatedProperty: Partial<Property>) => void;
  onCancel: () => void;
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long"
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long"
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number"
  }),
  capacity: z.coerce.number().int().positive({
    message: "Capacity must be a positive integer"
  }),
  address: z.string().min(3, {
    message: "Address is required"
  }),
  city: z.string().min(2, {
    message: "City is required"
  }),
  state: z.string().min(2, {
    message: "State is required"
  }),
  zip_code: z.string().min(5, {
    message: "Valid zip code is required"
  })
});

const EditPropertyForm = ({
  property,
  onSave,
  onCancel
}: EditPropertyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Split the location into components if available
  const addressParts = property.location.split(", ");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: property.name,
      description: property.description,
      price: property.price,
      capacity: property.capacity,
      address: property.address || addressParts[0] || "",
      city: property.city || (addressParts.length > 1 ? addressParts[1] : ""),
      state: property.state || (addressParts.length > 2 ? addressParts[2].split(" ")[0] : ""),
      zip_code: property.zip_code || (addressParts.length > 2 ? addressParts[2].split(" ")[1] : "")
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Format for database update
      const propertyUpdate = {
        name: values.name,
        description: values.description,
        price: values.price,
        capacity: values.capacity,
        address: values.address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code
      };

      // Update the database
      const { error } = await supabase
        .from('care_homes')
        .update(propertyUpdate)
        .eq('id', property.id);

      if (error) throw error;

      // Call the onSave prop with the new values
      onSave({
        ...propertyUpdate,
        location: `${values.address}, ${values.city}, ${values.state} ${values.zip_code}`
      });
      
      // Toast notifications have been removed
    } catch (error) {
      console.error("Error updating property:", error);
      // Toast notifications have been removed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter property name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your property"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Monthly Rent ($)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (residents)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPropertyForm;
