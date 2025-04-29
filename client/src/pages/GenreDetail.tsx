import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import GenreDetailComponent from "@/components/genres/GenreDetail";
import { genresApi } from "@/lib/api";

export default function GenreDetail() {
  // Get genre ID from URL
  const { id = '' } = useParams<{ id: string }>();
  
  // Fetch genre details and their books
  const { data, isLoading } = useQuery({
    queryKey: ['/api/genre', id],
    enabled: !!id,
    queryFn: async () => {
      const result = await genresApi.getById(id);
      return {
        genre: result.genre,
        genreBooks: result.genre_books || []
      };
    }
  });
  
  return (
    <section>
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link href="/genres" className="hover:text-primary hover:underline">Genres</Link>
        <i className="fas fa-chevron-right mx-2 text-xs"></i>
        <span>{data?.genre?.name || "Genre Detail"}</span>
      </div>
      
      <GenreDetailComponent 
        genre={data?.genre}
        books={data?.genreBooks || []}
        isLoading={isLoading}
      />
    </section>
  );
}
