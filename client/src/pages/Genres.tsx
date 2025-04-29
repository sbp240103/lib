import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import GenreList from "@/components/genres/GenreList";
import { genresApi, booksApi } from "@/lib/api";
import { transformGenresData, transformBooksData } from "@/types";

export default function Genres() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch genres
  const { data: genres, isLoading: isLoadingGenres } = useQuery({
    queryKey: [`${genresApi.getAll}`],
    queryFn: async () => {
      const data = await genresApi.getAll();
      return transformGenresData(data);
    }
  });
  
  // Fetch books to display with genres
  const { data: books, isLoading: isLoadingBooks } = useQuery({
    queryKey: [`${booksApi.getAll}`],
    queryFn: async () => {
      const data = await booksApi.getAll();
      return transformBooksData(data);
    }
  });
  
  const isLoading = isLoadingGenres || isLoadingBooks;
  
  return (
    <section id="genres">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Genres</h1>
          <p className="text-slate-500">Browse and manage book genres</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search genres..." 
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
          </div>
          <Link 
            href="/create-genre" 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>
            <span>Add Genre</span>
          </Link>
        </div>
      </div>
      
      <GenreList 
        genres={genres || []} 
        books={books || []}
        isLoading={isLoading} 
      />
    </section>
  );
}
