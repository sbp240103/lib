import { useState } from "react";
import { Link } from "wouter";
import BookCard from "./BookCard";
import { Book } from "@/types";

interface BookListProps {
  books: Book[];
  isLoading: boolean;
}

export default function BookList({ books, isLoading }: BookListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [genreFilter, setGenreFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;
  
  // Get unique genres for filter dropdown
  const genres = books 
    ? Array.from(new Set(books.flatMap(book => 
        book.genre && book.genre.map(g => g.name)
      ).filter(Boolean)))
    : [];
    
  // Get unique authors for filter dropdown
  const authors = books
    ? Array.from(new Set(books.map(book => 
        book.author && typeof book.author === 'object' ? book.author.name : null
      ).filter(Boolean)))
    : [];
  
  // Apply filters
  const filteredBooks = books.filter(book => {
    // Check if book matches genre filter
    const matchesGenre = !genreFilter || 
      (book.genre && book.genre.some(g => g.name === genreFilter));
      
    // Check if book matches author filter
    const matchesAuthor = !authorFilter || 
      (book.author && typeof book.author === 'object' && book.author.name === authorFilter);
      
    return matchesGenre && matchesAuthor;
  });
  
  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[2/3] bg-slate-200 rounded mb-3"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3 mb-3"></div>
                <div className="h-2 bg-slate-200 rounded mb-3"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">View:</span>
          <button 
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-400'}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <i className="fas fa-th-large"></i>
          </button>
          <button 
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-400'}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Filter by:</span>
          <select 
            className="bg-white border border-slate-300 rounded-md text-sm px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={genreFilter}
            onChange={(e) => {
              setGenreFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          <select 
            className="bg-white border border-slate-300 rounded-md text-sm px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={authorFilter}
            onChange={(e) => {
              setAuthorFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-500">
              No books found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
        <div className="text-sm text-slate-500">
          Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)} of {filteredBooks.length} books
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-slate-400 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {/* Only show a limited number of page buttons */}
          {[...Array(Math.min(totalPages, 3))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button 
                key={pageNum}
                className={`w-8 h-8 rounded ${currentPage === pageNum ? 'bg-primary text-white' : 'border border-slate-300 hover:bg-slate-50'} flex items-center justify-center`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 3 && currentPage < totalPages - 1 && (
            <span className="text-slate-400">...</span>
          )}
          
          {totalPages > 3 && (
            <button 
              className={`w-8 h-8 rounded ${currentPage === totalPages ? 'bg-primary text-white' : 'border border-slate-300 hover:bg-slate-50'} flex items-center justify-center`}
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          )}
          
          <button 
            className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
