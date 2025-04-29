import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import BookList from "@/components/books/BookList";
import { booksApi } from "@/lib/api";
import { transformBooksData } from "@/types";

export default function Books() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch books
  const { data: books, isLoading } = useQuery({
    queryKey: [`${booksApi.getAll}`],
    queryFn: async () => {
      const data = await booksApi.getAll();
      return transformBooksData(data);
    }
  });
  
  // Filter books by search query
  const filteredBooks = books 
    ? books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.author && typeof book.author === 'object' && 
         book.author.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];
  
  return (
    <section id="books">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Books</h1>
          <p className="text-slate-500">Manage and browse your book collection</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search books..." 
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
          </div>
          <Link 
            href="/add-book" 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i>
            <span>Add Book</span>
          </Link>
        </div>
      </div>
      
      <BookList books={filteredBooks} isLoading={isLoading} />
    </section>
  );
}
