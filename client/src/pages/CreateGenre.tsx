import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import GenreForm from "@/components/forms/GenreForm";
import { genresApi } from "@/lib/api";
import MainLayout from "@/components/layout/MainLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateGenre() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const genreMutation = useMutation({
    mutationFn: (data: any) => genresApi.create(data),
    onSuccess: (data) => {
      console.log("Genre creation successful:", data);
      
      toast({
        title: "Genre created",
        description: "The genre was created successfully.",
      });
      
      // Invalidate the genres query to update the list
      queryClient.invalidateQueries({ queryKey: ["/api/genres"] });
      
      // Add delay before navigation
      setTimeout(() => {
        setLocation("/genres");
      }, 500);
    },
    onError: (error) => {
      console.error("Error creating genre:", error);
      toast({
        title: "Error",
        description: "Failed to create genre. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      await genreMutation.mutateAsync(data);
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
          <h1 className="text-3xl font-bold">Create New Genre</h1>
          <p className="text-muted-foreground">Add a new genre to the catalog</p>
        </div>
        
        <GenreForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </MainLayout>
  );
}