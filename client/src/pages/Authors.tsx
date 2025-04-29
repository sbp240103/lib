import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AuthorList from "@/components/authors/AuthorList";
import { authorsApi, booksApi } from "@/lib/api";
import { transformAuthorsData, transformBooksData } from "@/types";

export default function Authors() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch authors
  const { data: authors, isLoading: isLoadingAuthors } = useQuery({
    queryKey: [`${authorsApi.getAll}`],
    queryFn: async () => {
      const data = await authorsApi.getAll();
      return transformAuthorsData(data);
    }
  });
  
  // Fetch books to count by author
  const { data: books, isLoading: isLoadingBooks } = useQuery({
    queryKey: [`${booksApi.getAll}`],
    queryFn: async () => {
      const data = await booksApi.getAll();
      return transformBooksData(data);
    }
  });
  
  // Count books by author
  const bookCountsByAuthor = books
    ? books.reduce((counts: Record<string, number>, book) => {
        if (book.author && typeof book.author === 'object') {
          const authorId = book.author._id;
          counts[authorId] = (counts[authorId] || 0) + 1;
        }
        return counts;
      }, {})
    : {};
  
  const isLoading = isLoadingAuthors || isLoadingBooks;
  
  return (
    <section id="authors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Authors</h1>
          <p className="text-slate-500">Manage and browse all authors</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search authors..." 
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
          </div>
          <Link 
            href="/create-author" 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>
            <span>Add Author</span>
          </Link>
        </div>
      </div>
      
      <AuthorList 
        authors={authors || []} 
        isLoading={isLoading}
        bookCounts={bookCountsByAuthor}
      />
    </section>
  );
}
