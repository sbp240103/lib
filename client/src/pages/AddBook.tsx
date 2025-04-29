import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import BookForm from "@/components/books/BookForm";
import { booksApi, authorsApi, genresApi } from "@/lib/api";
import { transformAuthorsData, transformGenresData } from "@/types";

export default function AddBook() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch authors for the dropdown
  const { data: authors, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ["/api/authors"],
    queryFn: async () => {
      const data = await authorsApi.getAll();
      return transformAuthorsData(data);
    }
  });
  
  // Fetch genres for the checkboxes
  const { data: genres, isLoading: isLoadingGenres } = useQuery({
    queryKey: ["/api/genres"],
    queryFn: async () => {
      const data = await genresApi.getAll();
      return transformGenresData(data);
    }
  });
  
  // Create book mutation
  const createBook = useMutation({
    mutationFn: (bookData: any) => booksApi.create(bookData),
    onSuccess: (data) => {
      console.log("Book creation successful:", data);
      
      // Show success toast
      toast({
        title: "Book created",
        description: "The book was successfully added to the library.",
      });
      
      // Invalidate books query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      
      // Explicitly add a small delay before navigating
      setTimeout(() => {
        // Redirect to books list after successful creation
        navigate("/books");
      }, 500);
    },
    onError: (error) => {
      console.error("Error creating book:", error);
      toast({
        title: "Error",
        description: "Failed to create book. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = async (data: any) => {
    // Format the data properly for the API
    const bookData = {
      title: data.title,
      author: data.author,
      summary: data.summary,
      isbn: data.isbn,
      genre: data.genre
    };
    
    await createBook.mutateAsync(bookData);
  };
  
  const isLoading = isLoadingAuthors || isLoadingGenres;
  const isSubmitting = createBook.isPending;
  
  return (
    <section>
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/books" className="hover:text-primary hover:underline">Books</Link>
        <i className="fas fa-chevron-right mx-2 text-xs"></i>
        <span>Add New Book</span>
      </div>
      
      <BookForm 
        authors={authors || []}
        genres={genres || []}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}
