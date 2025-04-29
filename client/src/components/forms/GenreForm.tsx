import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Form schema for genre
const genreSchema = z.object({
  name: z.string().min(3, "Genre name must be at least 3 characters long"),
});

type GenreFormData = z.infer<typeof genreSchema>;

interface GenreFormProps {
  initialData?: GenreFormData;
  onSubmit: (data: GenreFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function GenreForm({ initialData, onSubmit, isSubmitting = false }: GenreFormProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const form = useForm<GenreFormData>({
    resolver: zodResolver(genreSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const handleSubmit = async (data: GenreFormData) => {
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
        {initialData ? "Edit Genre" : "Create New Genre"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="form-group">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre:</FormLabel>
                  <FormControl>
                    <Input placeholder="Fantasy, Poetry etc." {...field} />
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