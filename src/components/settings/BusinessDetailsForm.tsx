import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// List of countries with their currency codes
const countries = [
  { name: "United States", code: "US", currency: "USD" },
  { name: "United Kingdom", code: "GB", currency: "GBP" },
  { name: "European Union", code: "EU", currency: "EUR" },
  { name: "Japan", code: "JP", currency: "JPY" },
  { name: "Canada", code: "CA", currency: "CAD" },
  { name: "Australia", code: "AU", currency: "AUD" },
  { name: "India", code: "IN", currency: "INR" },
  // Add more countries as needed
];

interface BusinessDetailsFormData {
  business_name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  country: string;
  currency_code: string;
}

export const BusinessDetailsForm = () => {
  const { toast } = useToast();
  const form = useForm<BusinessDetailsFormData>();

  const { data: businessDetails, refetch } = useQuery({
    queryKey: ["businessDetails"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("business_details")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const onSubmit = async (data: BusinessDetailsFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("business_details")
        .upsert({
          user_id: user.id,
          ...data,
        });

      if (error) throw error;

      toast({
        title: "Business details saved",
        description: "Your business details have been successfully updated.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error saving business details",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCountryChange = (value: string) => {
    const selectedCountry = countries.find(country => country.name === value);
    if (selectedCountry) {
      form.setValue("country", value);
      form.setValue("currency_code", selectedCountry.currency);
    }
  };

  useEffect(() => {
    if (businessDetails) {
      form.reset(businessDetails);
    }
  }, [businessDetails, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={handleCountryChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Details</Button>
      </form>
    </Form>
  );
};