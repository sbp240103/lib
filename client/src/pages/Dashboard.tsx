import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/dashboard/StatCard";
import RecentBooks from "@/components/dashboard/RecentBooks";
import GenreDistribution from "@/components/dashboard/GenreDistribution";
import { dashboardApi, booksApi } from "@/lib/api";
import { transformDashboardData, transformBooksData } from "@/types";

export default function Dashboard() {
  // Fetch dashboard stats
  const { data: dashboardData, isLoading: isLoadingStats } = useQuery({
    queryKey: [`${dashboardApi.getStats}`],
    queryFn: async () => {
      const data = await dashboardApi.getStats();
      return transformDashboardData(data);
    }
  });

  // Fetch books for recent books section
  const { data: books, isLoading: isLoadingBooks } = useQuery({
    queryKey: [`${booksApi.getAll}`],
    queryFn: async () => {
      const data = await booksApi.getAll();
      return transformBooksData(data);
    }
  });

  // Calculate genre distribution data (for visualization)
  const genreCounts = dashboardData?.genreCounts || [];
  
  // Book status counts
  const bookStatusCounts = [
    { status: 'Available', count: dashboardData?.book_instance_available_count || 0 },
    { status: 'Loaned', count: 2 }, // This would ideally come from the API
    { status: 'Maintenance', count: 1 }, // This would ideally come from the API
    { status: 'Reserved', count: 2 }, // This would ideally come from the API
  ];

  return (
    <section id="dashboard">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-500">Welcome to your library dashboard, Pushkar Singh.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon="fa-book" 
          iconColor="text-primary" 
          bgColor="bg-primary/10" 
          value={dashboardData?.book_count || 0} 
          label="Total Books" 
        />
        
        <StatCard 
          icon="fa-copy" 
          iconColor="text-secondary" 
          bgColor="bg-secondary/10" 
          value={dashboardData?.book_instance_count || 0} 
          label="Total Copies" 
        />
        
        <StatCard 
          icon="fa-check-circle" 
          iconColor="text-success" 
          bgColor="bg-success/10" 
          value={dashboardData?.book_instance_available_count || 0} 
          label="Available" 
        />
        
        <StatCard 
          icon="fa-user-edit" 
          iconColor="text-warning" 
          bgColor="bg-warning/10" 
          value={dashboardData?.author_count || 0} 
          label="Authors" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentBooks books={books || []} isLoading={isLoadingBooks} />
        
        <GenreDistribution 
          genres={genreCounts} 
          bookStatuses={bookStatusCounts}
          isLoading={isLoadingStats}
        />
      </div>
    </section>
  );
}
