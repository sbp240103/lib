import { Link } from "wouter";
import { GenreCount, BookStatusCount } from "@/types";

interface GenreDistributionProps {
  genres: GenreCount[];
  bookStatuses: BookStatusCount[];
  isLoading: boolean;
}

export default function GenreDistribution({ genres, bookStatuses, isLoading }: GenreDistributionProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-slate-800">Genre Distribution</h2>
          <Link href="/genres" className="text-primary text-sm hover:underline">View all</Link>
        </div>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-3"></div>
          <div className="h-6 bg-slate-200 rounded mb-3"></div>
          <div className="h-6 bg-slate-200 rounded mb-3"></div>
          <div className="h-6 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Calculate total book count for percentages
  const totalBooks = genres.reduce((sum, genre) => sum + genre.count, 0);

  // Calculate color classes for each genre
  const colors = ["bg-primary", "bg-secondary", "bg-warning", "bg-slate-400"];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-slate-800">Genre Distribution</h2>
        <Link href="/genres" className="text-primary text-sm hover:underline">View all</Link>
      </div>
      
      <ul className="space-y-3">
        {genres.map((genre, index) => {
          const percentage = totalBooks > 0 ? Math.round((genre.count / totalBooks) * 100) : 0;
          return (
            <li key={genre.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{genre.name}</span>
                <span className="text-slate-500">{percentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`${colors[index % colors.length]} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
              </div>
            </li>
          );
        })}
        {genres.length === 0 && (
          <li className="text-sm text-slate-500 text-center py-2">No genre data available</li>
        )}
      </ul>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800">Book Status</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-100 rounded-lg p-3">
            <div className="text-success text-xl mb-1">
              <i className="fas fa-check-circle"></i>
            </div>
            <p className="text-xs font-medium text-slate-600">Available</p>
            <p className="text-lg font-semibold">{bookStatuses.find(s => s.status === 'Available')?.count || 0}</p>
          </div>
          
          <div className="bg-slate-100 rounded-lg p-3">
            <div className="text-warning text-xl mb-1">
              <i className="fas fa-clock"></i>
            </div>
            <p className="text-xs font-medium text-slate-600">Loaned</p>
            <p className="text-lg font-semibold">{bookStatuses.find(s => s.status === 'Loaned')?.count || 0}</p>
          </div>
          
          <div className="bg-slate-100 rounded-lg p-3">
            <div className="text-error text-xl mb-1">
              <i className="fas fa-tools"></i>
            </div>
            <p className="text-xs font-medium text-slate-600">Maintenance</p>
            <p className="text-lg font-semibold">{bookStatuses.find(s => s.status === 'Maintenance')?.count || 0}</p>
          </div>
          
          <div className="bg-slate-100 rounded-lg p-3">
            <div className="text-info text-xl mb-1">
              <i className="fas fa-bookmark"></i>
            </div>
            <p className="text-xs font-medium text-slate-600">Reserved</p>
            <p className="text-lg font-semibold">{bookStatuses.find(s => s.status === 'Reserved')?.count || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
