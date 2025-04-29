import { Link } from "wouter";
import { Author, Book } from "@/types";

interface AuthorDetailProps {
  author: Author;
  authorBooks: Book[];
  isLoading: boolean;
}

export default function AuthorDetail({ author, authorBooks, isLoading }: AuthorDetailProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <div className="bg-slate-200 rounded-lg h-64 mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-slate-200 rounded"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="lg:w-2/3">
              <div className="h-8 bg-slate-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded mb-6 w-1/3"></div>
              <div className="space-y-4 mb-6">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded mb-4 w-1/4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-32 bg-slate-200 rounded"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-4xl text-slate-300 mb-4">
            <i className="fas fa-user-slash"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Author Not Found</h2>
          <p className="text-slate-500 mb-6">The author you are looking for does not exist or has been removed.</p>
          <Link href="/authors" className="text-primary hover:underline">Return to author list</Link>
        </div>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate age/lifespan
  const calculateLifespan = () => {
    if (!author.date_of_birth) return "";
    
    const birthDate = new Date(author.date_of_birth);
    let endDate;
    let prefix = "";
    
    if (author.date_of_death) {
      endDate = new Date(author.date_of_death);
      prefix = "Lived for ";
    } else {
      endDate = new Date();
      prefix = "Age: ";
    }
    
    const yearDiff = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();
    const dayDiff = endDate.getDate() - birthDate.getDate();
    
    let age = yearDiff;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    
    return `${prefix}${age} years`;
  };

  // Get initials for avatar
  const getInitials = () => {
    if (author.first_name && author.family_name) {
      return `${author.first_name.charAt(0)}${author.family_name.charAt(0)}`;
    }
    return author.name?.split(' ').map(n => n.charAt(0)).join('') || 'AU';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="bg-primary/10 rounded-lg p-8 flex flex-col items-center justify-center mb-6">
              <div className="w-32 h-32 rounded-full bg-primary/20 text-primary flex items-center justify-center text-5xl font-bold mb-4">
                {getInitials()}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 text-center mb-1">{author.name}</h2>
              <p className="text-slate-500 text-center">
                {author.date_of_birth ? formatDate(author.date_of_birth) : ''}
                {author.date_of_birth && author.date_of_death ? ' - ' : ''}
                {author.date_of_death ? formatDate(author.date_of_death) : ''}
              </p>
              {(author.date_of_birth) && (
                <p className="text-sm text-slate-500 mt-1">{calculateLifespan()}</p>
              )}
            </div>
            
            <div className="space-y-3">
              <Link href={`/author/${author._id}/edit`} className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                <i className="fas fa-edit"></i>
                <span>Edit Author</span>
              </Link>
              
              <Link href={`/author/${author._id}/delete`} className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors border border-slate-300 flex items-center justify-center gap-2">
                <i className="fas fa-trash-alt text-error"></i>
                <span>Delete Author</span>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-2/3">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Books by this Author</h2>
            
            {authorBooks && authorBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {authorBooks.map((book) => (
                  <div key={book._id} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <Link href={`/book/${book._id}`}>
                      <h3 className="font-medium text-slate-800 hover:text-primary mb-1">{book.title}</h3>
                    </Link>
                    <p className="text-xs text-slate-500 mb-2">
                      {book.genre && book.genre.length > 0 
                        ? book.genre.map(g => g.name).join(', ') 
                        : 'No genre specified'}
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-3">{book.summary}</p>
                    <Link href={`/book/${book._id}`} className="text-primary text-sm font-medium hover:underline">
                      View book
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg p-6 text-center mb-6">
                <div className="text-4xl text-slate-300 mb-3">
                  <i className="fas fa-book-open"></i>
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">No Books Found</h3>
                <p className="text-slate-500 mb-4">This author doesn't have any books in the library yet.</p>
                <Link href="/add-book" className="text-primary hover:underline">Add a book by this author</Link>
              </div>
            )}
            
            {author.first_name && author.family_name && (
              <div className="border-t border-slate-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Author Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">First Name</h4>
                    <p className="text-slate-800">{author.first_name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Family Name</h4>
                    <p className="text-slate-800">{author.family_name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Date of Birth</h4>
                    <p className="text-slate-800">{formatDate(author.date_of_birth) || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Date of Death</h4>
                    <p className="text-slate-800">{formatDate(author.date_of_death) || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
