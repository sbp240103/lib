import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import AuthorForm from "@/components/forms/AuthorForm";
import { authorsApi } from "@/lib/api";
import MainLayout from "@/components/layout/MainLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateAuthor() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const authorMutation = useMutation({
    mutationFn: (data: any) => authorsApi.create(data),
    onSuccess: (data) => {
      console.log("Author creation successful:", data);
      
      toast({
        title: "Author created",
        description: "The author was created successfully.",
      });
      
      // Invalidate the authors query to update the list
      queryClient.invalidateQueries({ queryKey: ["/api/authors"] });
      
      // Add delay before navigation
      setTimeout(() => {
        setLocation("/authors");
      }, 500);
    },
    onError: (error) => {
      console.error("Error creating author:", error);
      toast({
        title: "Error",
        description: "Failed to create author. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      await authorMutation.mutateAsync(data);
    } catch (error) {
      // Error handled in mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Author</h1>
          <p className="text-muted-foreground">Add a new author to the catalog</p>
        </div>
        
        <AuthorForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </MainLayout>
  );
}