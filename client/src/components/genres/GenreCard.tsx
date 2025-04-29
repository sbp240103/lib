import { Link } from "wouter";
import { Genre, Book } from "@/types";

interface GenreCardProps {
  genre: Genre;
  books?: Book[];
}

export default function GenreCard({ genre, books = [] }: GenreCardProps) {
  // Determine border color based on genre name
  const getBorderColor = () => {
    const name = genre.name.toLowerCase();
    if (name.includes('fantasy')) return 'border-primary';
    if (name.includes('science') || name.includes('sci-fi')) return 'border-secondary';
    if (name.includes('poetry') || name.includes('french')) return 'border-warning';
    
    // Hash the genre name to get a consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = ['border-primary', 'border-secondary', 'border-warning', 'border-info', 'border-success'];
    return colors[Math.abs(hash) % colors.length];
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${getBorderColor()}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-slate-800 mb-1">{genre.name}</h3>
          <p className="text-sm text-slate-500">{books.length} {books.length === 1 ? 'book' : 'books'}</p>
        </div>
        <div className="flex items-center">
          <Link 
            href={`/genre/${genre._id}/edit`} 
            className="text-slate-400 hover:text-primary p-1"
            aria-label={`Edit ${genre.name}`}
          >
            <i className="fas fa-edit"></i>
          </Link>
          <Link 
            href={`/genre/${genre._id}/delete`} 
            className="text-slate-400 hover:text-error p-1 ml-1"
            aria-label={`Delete ${genre.name}`}
          >
            <i className="fas fa-trash-alt"></i>
          </Link>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center text-sm text-slate-600 mb-2">
          <i className="fas fa-book-open mr-2 text-slate-400"></i>
          Related books:
        </div>
        {books.length > 0 ? (
          <ul className="text-sm space-y-1">
            {books.slice(0, 5).map((book) => (
              <li key={book._id}>
                <Link 
                  href={`/book/${book._id}`} 
                  className="text-primary hover:underline"
                >
                  {book.title}
                </Link>
              </li>
            ))}
            {books.length > 5 && (
              <li className="text-slate-500 italic">
                {books.length - 5} more book{books.length - 5 !== 1 ? 's' : ''}...
              </li>
            )}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic">No books in this genre</p>
        )}
      </div>
    </div>
  );
}
