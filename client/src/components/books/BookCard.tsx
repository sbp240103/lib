import { Link } from "wouter";
import { StatusBadge } from "@/components/ui/status-badge";
import { Book } from "@/types";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  // Ensure genre is an array and get the first genre name
  const genreName = book.genre && book.genre.length > 0 
    ? book.genre[0].name 
    : null;
    
  // Determine background color based on genre
  const getBgColor = () => {
    if (!genreName) return "bg-primary/80";
    switch(genreName.toLowerCase()) {
      case "fantasy": return "bg-primary/80";
      case "science fiction": return "bg-secondary/80";
      case "french poetry": return "bg-warning/80";
      default: return "bg-primary/80";
    }
  };
  
  // Format the author name
  const authorName = book.author && typeof book.author === 'object'
    ? book.author.name
    : 'Unknown author';
    
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
      <div className="aspect-[2/3] bg-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          <i className="fas fa-book text-4xl"></i>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-3">
          <div className="flex flex-wrap gap-1">
            {genreName && (
              <span className={`px-2 py-1 ${getBgColor()} text-white text-xs rounded`}>
                {genreName}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <Link href={`/book/${book._id}`}>
          <h3 className="font-semibold text-slate-800 group-hover:text-primary transition-colors mb-1">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 mb-3">{authorName}</p>
        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
          {book.summary}
        </p>
        <div className="flex justify-between items-center">
          <StatusBadge status={book.status || "Available"} />
          <button className="text-slate-400 hover:text-primary">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
