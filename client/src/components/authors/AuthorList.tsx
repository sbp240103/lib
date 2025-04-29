import { useState } from "react";
import { Link } from "wouter";
import AuthorCard from "./AuthorCard";
import { Author } from "@/types";

interface AuthorListProps {
  authors: Author[];
  isLoading: boolean;
  bookCounts?: Record<string, number>; // Map of author IDs to book counts
}

export default function AuthorList({ authors, isLoading, bookCounts = {} }: AuthorListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 8;
  
  // Filter authors based on search query
  const filteredAuthors = authors.filter(author => {
    const fullName = author.name || `${author.first_name} ${author.family_name}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Pagination
  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = filteredAuthors.slice(indexOfFirstAuthor, indexOfLastAuthor);
  const totalPages = Math.ceil(filteredAuthors.length / authorsPerPage);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-full"></div>
                  <div className="ml-4">
                    <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="h-3 bg-slate-200 rounded"></div>
                  <div className="h-3 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentAuthors.length > 0 ? (
            currentAuthors.map((author) => (
              <AuthorCard 
                key={author._id} 
                author={author} 
                bookCount={bookCounts[author._id] || 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-500">
              {searchQuery 
                ? `No authors found matching "${searchQuery}". Try a different search.`
                : "No authors found in the library."}
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
        <div className="text-sm text-slate-500">
          Showing {filteredAuthors.length > 0 ? indexOfFirstAuthor + 1 : 0}-{Math.min(indexOfLastAuthor, filteredAuthors.length)} of {filteredAuthors.length} authors
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-slate-400 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {/* Page buttons */}
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
