import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Form schema for author
const authorSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  family_name: z.string().min(1, "Family name is required"),
  date_of_birth: z.string().optional(),
  date_of_death: z.string().optional(),
});

type AuthorFormData = z.infer<typeof authorSchema>;

interface AuthorFormProps {
  initialData?: AuthorFormData;
  onSubmit: (data: AuthorFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function AuthorForm({ initialData, onSubmit, isSubmitting = false }: AuthorFormProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const form = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    defaultValues: initialData || {
      first_name: "",
      family_name: "",
      date_of_birth: "",
      date_of_death: "",
    },
  });

  const handleSubmit = async (data: AuthorFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors(["Failed to submit form. Please try again."]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {initialData ? "Edit Author" : "Create New Author"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="form-group">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>First Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="First name (Christian)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="family_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="Family name (Surname)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="form-group">
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth:</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>

      {errors.length > 0 && (
        <div className="mt-4">
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600" dangerouslySetInnerHTML={{ __html: error }} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}