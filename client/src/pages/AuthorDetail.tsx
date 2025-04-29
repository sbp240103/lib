import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import AuthorDetailComponent from "@/components/authors/AuthorDetail";
import { authorsApi } from "@/lib/api";
import { Book } from "@/types";

export default function AuthorDetail() {
  // Get author ID from URL
  const { id = '' } = useParams<{ id: string }>();
  
  // Fetch author details and their books
  const { data, isLoading } = useQuery({
    queryKey: ['/api/author', id],
    enabled: !!id,
    queryFn: async () => {
      const result = await authorsApi.getById(id);
      return {
        author: result.author,
        authorBooks: result.author_books || []
      };
    }
  });
  
  return (
    <section>
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/authors" className="hover:text-primary hover:underline">Authors</Link>
        <i className="fas fa-chevron-right mx-2 text-xs"></i>
        <span>{data?.author?.name || "Author Detail"}</span>
      </div>
      
      <AuthorDetailComponent 
        author={data?.author}
        authorBooks={data?.authorBooks || []}
        isLoading={isLoading}
      />
    </section>
  );
}
