import { Link } from "wouter";
import { Genre, Book } from "@/types";

interface GenreDetailProps {
  genre: Genre;
  books: Book[];
  isLoading: boolean;
}

export default function GenreDetail({ genre, books, isLoading }: GenreDetailProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 animate-pulse">
          <div className="h-8 bg-slate-200 rounded mb-2 w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded mb-6 w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="h-40 bg-slate-200 rounded"></div>
            <div className="h-40 bg-slate-200 rounded"></div>
            <div className="h-40 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!genre) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-4xl text-slate-300 mb-4">
            <i className="fas fa-tag"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Genre Not Found</h2>
          <p className="text-slate-500 mb-6">The genre you are looking for does not exist or has been removed.</p>
          <Link href="/genres" className="text-primary hover:underline">Return to genre list</Link>
        </div>
      </div>
    );
  }

  // Function to determine background color based on genre name
  const getHeaderColor = () => {
    const name = genre.name.toLowerCase();
    if (name.includes('fantasy')) return 'bg-primary';
    if (name.includes('science') || name.includes('sci-fi')) return 'bg-secondary';
    if (name.includes('poetry') || name.includes('french')) return 'bg-warning';
    
    // Hash the genre name to get a consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = ['bg-primary', 'bg-secondary', 'bg-warning', 'bg-info', 'bg-success'];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className={`${getHeaderColor()} text-white px-6 py-8`}>
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">{genre.name}</h1>
          <p className="text-white/80 text-lg">
            {books.length} {books.length === 1 ? 'book' : 'books'} in this genre
          </p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-end gap-3 mb-6">
          <Link href={`/genre/${genre._id}/edit`} className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2">
            <i className="fas fa-edit"></i>
            <span>Edit Genre</span>
          </Link>
          <Link href={`/genre/${genre._id}/delete`} className="px-4 py-2 bg-white hover:bg-slate-50 text-error border border-slate-300 rounded-lg transition-colors flex items-center gap-2">
            <i className="fas fa-trash-alt"></i>
            <span>Delete Genre</span>
          </Link>
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 mb-4">Books in this Genre</h2>
        
        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book._id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400">
                  <i className="fas fa-book text-3xl"></i>
                </div>
                <div className="p-4">
                  <Link href={`/book/${book._id}`}>
                    <h3 className="font-semibold text-slate-800 hover:text-primary mb-1">{book.title}</h3>
                  </Link>
                  <p className="text-sm text-slate-500 mb-2">
                    {book.author && typeof book.author === 'object' 
                      ? book.author.name 
                      : 'Unknown author'}
                  </p>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{book.summary}</p>
                  <div className="flex justify-end">
                    <Link href={`/book/${book._id}`} className="text-primary text-sm font-medium hover:underline">
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <div className="text-4xl text-slate-300 mb-4">
              <i className="fas fa-book-open"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Books Found</h3>
            <p className="text-slate-500 mb-6">There are no books assigned to this genre yet.</p>
            <Link href="/add-book" className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
              <i className="fas fa-plus-circle"></i>
              <span>Add a Book</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
