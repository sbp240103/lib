import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import BookDetailComponent from "@/components/books/BookDetail";
import { booksApi } from "@/lib/api";
import { transformBookData, transformBookInstancesData } from "@/types";

export default function BookDetail() {
  // Get book ID from URL
  const { id } = useParams();
  
  // Fetch book details
  const { data: book, isLoading: isLoadingBook } = useQuery({
    queryKey: [`${booksApi.getById(id)}`],
    queryFn: async () => {
      const data = await booksApi.getById(id);
      return transformBookData(data);
    }
  });
  
  // Extract book instances from book data or fetch separately if needed
  const bookInstances = book?.book_instances || [];
  const isLoading = isLoadingBook;
  
  return (
    <section>
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/books" className="hover:text-primary hover:underline">Books</Link>
        <i className="fas fa-chevron-right mx-2 text-xs"></i>
        <span>{book?.title || "Book Detail"}</span>
      </div>
      
      <BookDetailComponent 
        book={book}
        bookInstances={bookInstances}
        isLoading={isLoading}
      />
    </section>
  );
}
