import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Author, Genre } from "@/types";
import { Link } from "wouter";

interface BookFormProps {
  initialData?: any;
  authors: Author[];
  genres: Genre[];
  isLoading: boolean;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function BookForm({ 
  initialData,
  authors, 
  genres, 
  isLoading, 
  onSubmit,
  isSubmitting
}: BookFormProps) {
  const { toast } = useToast();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: initialData || {
      title: '',
      author: '',
      summary: '',
      isbn: '',
      genre: []
    }
  });
  
  // Initialize selected genres from initial data
  useEffect(() => {
    if (initialData && initialData.genre) {
      if (Array.isArray(initialData.genre)) {
        const genreIds = initialData.genre.map((g: any) => 
          typeof g === 'object' ? g._id : g
        );
        setSelectedGenres(genreIds);
      } else if (typeof initialData.genre === 'string') {
        setSelectedGenres([initialData.genre]);
      }
    }
  }, [initialData]);
  
  const handleGenreChange = (genreId: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };
  
  const submitForm = async (data: any) => {
    try {
      // Add the selected genres to the form data - this expected format is important for the server
      data.genre = selectedGenres;
      await onSubmit(data);
      reset();
      toast({
        title: initialData ? "Book updated" : "Book created",
        description: initialData 
          ? "The book has been successfully updated." 
          : "The book has been successfully added to the library.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? 'update' : 'create'} book. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 animate-pulse">
          <div className="h-8 bg-slate-200 rounded mb-4 w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded mb-6 w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="h-16 bg-slate-200 rounded"></div>
            <div className="h-16 bg-slate-200 rounded"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
          <div className="h-10 bg-slate-200 rounded w-1/4 ml-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h1 className="text-lg font-bold text-slate-800">
          {initialData ? 'Edit Book' : 'Add New Book'}
        </h1>
        <p className="text-sm text-slate-500">
          {initialData
            ? 'Update the details for this book'
            : 'Enter the details for the new book'}
        </p>
      </div>
      
      <div className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Title <span className="text-error">*</span>
              </label>
              <input 
                type="text" 
                id="title" 
                className={`w-full px-3 py-2 border ${errors.title ? 'border-error' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                placeholder="Book title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-error">{errors.title.message as string}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-1">
                Author <span className="text-error">*</span>
              </label>
              <select 
                id="author" 
                className={`w-full px-3 py-2 border ${errors.author ? 'border-error' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                {...register("author", { required: "Author is required" })}
              >
                <option value="">Select an author</option>
                {authors
                  .filter(author => author._id !== "create")
                  .map((author) => (
                    <option key={author._id} value={author._id}>
                      {author.name}
                    </option>
                  ))}
              </select>
              {errors.author && (
                <p className="mt-1 text-xs text-error">{errors.author.message as string}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="summary" className="block text-sm font-medium text-slate-700 mb-1">
                Summary <span className="text-error">*</span>
              </label>
              <textarea 
                id="summary" 
                rows={4} 
                className={`w-full px-3 py-2 border ${errors.summary ? 'border-error' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                placeholder="Book summary or description"
                {...register("summary", { required: "Summary is required" })}
              ></textarea>
              {errors.summary && (
                <p className="mt-1 text-xs text-error">{errors.summary.message as string}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-slate-700 mb-1">
                ISBN <span className="text-error">*</span>
              </label>
              <input 
                type="text" 
                id="isbn" 
                className={`w-full px-3 py-2 border ${errors.isbn ? 'border-error' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                placeholder="ISBN number"
                {...register("isbn", { required: "ISBN is required" })}
              />
              {errors.isbn && (
                <p className="mt-1 text-xs text-error">{errors.isbn.message as string}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Genre <span className="text-error">*</span>
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-2">
                {genres
                  .filter(genre => genre._id !== 'create') // Filter out the "Create new genre" placeholder
                  .map((genre) => (
                    <div key={genre._id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`genre-${genre._id}`} 
                        checked={selectedGenres.includes(genre._id)}
                        onChange={() => handleGenreChange(genre._id)}
                        className="w-4 h-4 text-primary focus:ring-primary/20 rounded"
                      />
                      <label htmlFor={`genre-${genre._id}`} className="ml-2 text-sm text-slate-700">
                        {genre.name}
                      </label>
                    </div>
                ))}
                {genres.filter(genre => genre._id !== 'create').length === 0 && (
                  <p className="text-sm text-slate-500 py-2">
                    No genres available. Please <Link href="/genres/create" className="text-primary hover:underline">create a genre</Link> first.
                  </p>
                )}
              </div>
              {selectedGenres.length === 0 && (
                <p className="mt-1 text-xs text-error">At least one genre must be selected</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Link href="/books" className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 mr-3">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-70"
              disabled={isSubmitting || selectedGenres.length === 0}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {initialData ? 'Updating...' : 'Saving...'}
                </span>
              ) : (
                <span>{initialData ? 'Update Book' : 'Save Book'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
