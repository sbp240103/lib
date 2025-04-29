import { useState } from "react";
import { Link } from "wouter";
import GenreCard from "./GenreCard";
import { Genre, Book } from "@/types";

interface GenreListProps {
  genres: Genre[];
  books: Book[];
  isLoading: boolean;
}

export default function GenreList({ genres, books, isLoading }: GenreListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter genres based on search query
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group books by genre
  const booksByGenre = genres.reduce<Record<string, Book[]>>((acc, genre) => {
    acc[genre._id] = books.filter(book => 
      book.genre && book.genre.some(g => g._id === genre._id)
    );
    return acc;
  }, {});
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-3"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {filteredGenres.length > 0 ? (
        filteredGenres.map((genre) => (
          <GenreCard 
            key={genre._id} 
            genre={genre} 
            books={booksByGenre[genre._id] || []}
          />
        ))
      ) : (
        <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-4xl text-slate-300 mb-4">
            <i className="fas fa-tag"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">No Genres Found</h2>
          <p className="text-slate-500 mb-6">
            {searchQuery 
              ? `No genres matching "${searchQuery}". Try a different search.`
              : "There are no genres in the library yet."}
          </p>
          <Link 
            href="/genre/create" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <i className="fas fa-plus-circle"></i>
            <span>Add a Genre</span>
          </Link>
        </div>
      )}
    </div>
  );
}
