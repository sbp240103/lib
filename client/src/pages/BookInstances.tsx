import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { bookInstancesApi } from "@/lib/api";
import { transformBookInstancesData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function BookInstances() {
  const { data: bookInstances = [], isLoading } = useQuery({
    queryKey: ["/api/bookinstances"],
    queryFn: () => bookInstancesApi.getAll(),
    select: (data) => transformBookInstancesData(data),
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Maintenance</Badge>;
      case "loaned":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Loaned</Badge>;
      case "reserved":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Reserved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Book Copies</h1>
            <p className="text-muted-foreground">Browse all copies of books in the library</p>
          </div>
          <Link href="/create-bookinstance">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookInstances.map((instance) => (
              <div 
                key={instance._id}
                className="bg-white shadow rounded-lg p-4 border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h3 className="font-medium">
                      <Link 
                        href={`/book/${typeof instance.book === 'object' ? instance.book._id : instance.book}`}
                        className="text-blue-600 hover:underline"
                      >
                        {typeof instance.book === 'object' ? instance.book.title : 'Unknown Book'}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600">
                      {instance.imprint}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>{getStatusBadge(instance.status)}</div>
                    {instance.due_back && (
                      <p className="text-sm text-gray-600">
                        Due: {instance.due_back_formatted || instance.due_back}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {bookInstances.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No book copies found in the database.</p>
                <Link href="/create-bookinstance">
                  <Button variant="link" className="mt-2">
                    Create your first book copy
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}