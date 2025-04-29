import { Link } from "wouter";
import { Book } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";

interface RecentBooksProps {
  books: Book[];
  isLoading: boolean;
}

export default function RecentBooks({ books, isLoading }: RecentBooksProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-slate-800">Recent Books</h2>
          <Link href="/books" className="text-primary text-sm hover:underline">View all</Link>
        </div>
        <div className="animate-pulse">
          <div className="h-12 bg-slate-200 rounded mb-4"></div>
          <div className="h-12 bg-slate-200 rounded mb-4"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-slate-800">Recent Books</h2>
        <Link href="/books" className="text-primary text-sm hover:underline">View all</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {books.length > 0 ? (
              books.slice(0, 3).map((book) => (
                <tr key={book._id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-12 bg-slate-200 rounded flex-shrink-0 flex items-center justify-center text-slate-400">
                        <i className="fas fa-book"></i>
                      </div>
                      <div className="ml-3">
                        <Link href={`/book/${book._id}`}>
                          <p className="text-sm font-medium text-slate-800 hover:text-primary">{book.title}</p>
                        </Link>
                        <p className="text-xs text-slate-500">
                          {book.genre && book.genre.length > 0 ? book.genre[0].name : 'No genre'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {book.author && typeof book.author === 'object' ? book.author.name : 'Unknown author'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={book.status || "Available"} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-sm text-slate-500">
                  No books available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
