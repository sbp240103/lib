import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Book } from "../../types";

// Form schema for book instance
const bookInstanceSchema = z.object({
  book: z.string()
    .refine(val => val !== "placeholder", "Book selection is required"),
  imprint: z.string()
    .min(1, "Imprint is required"),
  status: z.string()
    .refine(val => val !== "placeholder", "Status selection is required"),
  due_back: z.string().optional(),
});

type BookInstanceFormData = z.infer<typeof bookInstanceSchema>;

interface BookInstanceFormProps {
  books: Book[];
  initialData?: BookInstanceFormData;
  onSubmit: (data: BookInstanceFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function BookInstanceForm({ 
  books, 
  initialData, 
  onSubmit, 
  isSubmitting = false 
}: BookInstanceFormProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const form = useForm<BookInstanceFormData>({
    resolver: zodResolver(bookInstanceSchema),
    defaultValues: initialData || {
      book: "placeholder",
      imprint: "",
      status: "placeholder",
      due_back: "",
    },
  });

  const handleSubmit = async (data: BookInstanceFormData) => {
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
        {initialData ? "Edit Book Copy" : "Create New Book Instance (Copy)"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="book"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book:</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="--Please select a book--" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="placeholder">--Please select a book--</SelectItem>
                    {books.filter(book => book._id !== "create").map((book) => (
                      <SelectItem 
                        key={book._id} 
                        value={typeof book._id === 'string' ? book._id : 'unknown'}
                      >
                        {book.title}
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
            name="imprint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imprint:</FormLabel>
                <FormControl>
                  <Input placeholder="Publisher and date information" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_back"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date when book available:</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status:</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="--Please select a status--" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="placeholder">--Please select a status--</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Loaned">Loaned</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>

      {errors.length > 0 && (
        <div className="mt-4 p-4 border border-red-400 bg-red-50 rounded">
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}