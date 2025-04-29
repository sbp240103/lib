import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Books from "@/pages/Books";
import BookDetail from "@/pages/BookDetail";
import AddBook from "@/pages/AddBook";
import Authors from "@/pages/Authors";
import AuthorDetail from "@/pages/AuthorDetail";
import Genres from "@/pages/Genres";
import GenreDetail from "@/pages/GenreDetail";
import BookInstances from "@/pages/BookInstances";
import CreateAuthor from "@/pages/CreateAuthor";
import CreateGenre from "@/pages/CreateGenre";
import CreateBookInstance from "@/pages/CreateBookInstance";
import MainLayout from "@/components/layout/MainLayout";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/books" component={Books} />
        <Route path="/book/:id" component={BookDetail} />
        <Route path="/add-book" component={AddBook} />
        <Route path="/authors" component={Authors} />
        <Route path="/author/:id" component={AuthorDetail} />
        <Route path="/genres" component={Genres} />
        <Route path="/genre/:id" component={GenreDetail} />
        <Route path="/bookinstances" component={BookInstances} />
        <Route path="/create-author" component={CreateAuthor} />
        <Route path="/create-genre" component={CreateGenre} />
        <Route path="/create-bookinstance" component={CreateBookInstance} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
