import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import BookInstanceForm from "@/components/forms/BookInstanceForm";
import { bookInstancesApi, booksApi } from "@/lib/api";
import MainLayout from "@/components/layout/MainLayout";
import { transformBooksData } from "@/types";

export default function CreateBookInstance() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["/api/books"],
    select: (data) => transformBooksData(data).filter(book => book._id !== "create"),
  });
  
  const bookInstanceMutation = useMutation({
    mutationFn: (data: any) => bookInstancesApi.create(data),
    onSuccess: (data) => {
      console.log("Book instance creation successful:", data);
      
      toast({
        title: "Book copy created",
        description: "The book copy was created successfully.",
      });
      
      // Invalidate any bookinstances queries
      queryClient.invalidateQueries({ queryKey: ["/api/bookinstances"] });
      
      // Add delay before navigation
      setTimeout(() => {
        setLocation("/bookinstances");
      }, 500);
    },
    onError: (error) => {
      console.error("Error creating book copy:", error);
      toast({
        title: "Error",
        description: "Failed to create book copy. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      await bookInstanceMutation.mutateAsync(data);
    } catch (error) {
      // Error handling in mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Book Copy</h1>
          <p className="text-muted-foreground">Add a new physical copy of a book to the library</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <BookInstanceForm 
            books={books} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        )}
      </div>
    </MainLayout>
  );
}