import { Link } from "wouter";
import { StatusBadge } from "@/components/ui/status-badge";
import { Book, BookInstance } from "@/types";

interface BookDetailProps {
  book: Book;
  bookInstances: BookInstance[];
  isLoading: boolean;
}

export default function BookDetail({ book, bookInstances, isLoading }: BookDetailProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 w-full md:w-64">
              <div className="aspect-[2/3] bg-slate-200 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-slate-200 rounded"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-8 bg-slate-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded mb-6 w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                <div className="h-16 bg-slate-200 rounded"></div>
                <div className="h-16 bg-slate-200 rounded"></div>
                <div className="h-16 bg-slate-200 rounded"></div>
                <div className="h-16 bg-slate-200 rounded"></div>
              </div>
              <div className="h-32 bg-slate-200 rounded mb-8"></div>
              <div className="h-6 bg-slate-200 rounded mb-4 w-1/4"></div>
              <div className="h-40 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-4xl text-slate-300 mb-4">
            <i className="fas fa-book-open"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Book Not Found</h2>
          <p className="text-slate-500 mb-6">The book you are looking for does not exist or has been removed.</p>
          <Link href="/books" className="text-primary hover:underline">Return to book list</Link>
        </div>
      </div>
    );
  }

  // Format author name
  const authorName = book.author && typeof book.author === 'object' 
    ? book.author.name 
    : 'Unknown author';
  
  // Format author id for URL
  const authorId = book.author && typeof book.author === 'object' 
    ? book.author._id 
    : '';

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-64">
          <div className="aspect-[2/3] bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 mb-4">
            <i className="fas fa-book text-6xl"></i>
          </div>
          
          <div className="space-y-3">
            <Link href={`/book/${book._id}/edit`} className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center justify-center gap-2">
              <i className="fas fa-edit"></i>
              <span>Edit Book</span>
            </Link>
            
            <Link href={`/book/${book._id}/delete`} className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors border border-slate-300 flex items-center justify-center gap-2">
              <i className="fas fa-trash-alt text-error"></i>
              <span>Delete Book</span>
            </Link>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">{book.title}</h1>
              <p className="text-sm text-slate-500 mb-3">{book.series || ''}</p>
            </div>
            <StatusBadge status={book.status || "Available"} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-1">Author</h3>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <i className="fas fa-user-edit"></i>
                </div>
                <Link href={`/author/${authorId}`} className="ml-2 text-primary hover:underline">{authorName}</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-1">ISBN</h3>
              <p>{book.isbn}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-1">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {book.genre && book.genre.length > 0 ? (
                  book.genre.map((genre) => (
                    <Link key={genre._id} href={`/genre/${genre._id}`}>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded hover:bg-primary/20">
                        {genre.name}
                      </span>
                    </Link>
                  ))
                ) : (
                  <span className="text-slate-500 text-sm">No genres specified</span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-1">Language</h3>
              <p>English</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-500 mb-2">Summary</h3>
            <p className="text-slate-700">{book.summary}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Copies ({bookInstances ? bookInstances.length : 0})
            </h3>
            
            {bookInstances && bookInstances.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Imprint</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Back</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {bookInstances.map((instance) => (
                      <tr key={instance._id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{instance.imprint}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={instance.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {instance.status !== 'Available' && instance.due_back_formatted 
                            ? instance.due_back_formatted 
                            : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-primary">
                          <Link href={`/bookinstance/${instance._id}`} className="hover:underline">
                            {instance._id.substring(instance._id.length - 6).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          <Link href={`/bookinstance/${instance._id}/edit`} className="text-slate-400 hover:text-primary">
                            <i className="fas fa-edit"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 italic">There are no copies of this book in the library.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
