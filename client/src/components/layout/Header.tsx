import { useState } from "react";
import { Link } from "wouter";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <header className="bg-primary text-white shadow-md z-10 fixed top-0 left-0 right-0">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars"></i>
          </button>
          <Link href="/" className="flex items-center">
            <i className="fas fa-book-open text-2xl mr-2"></i>
            <h1 className="text-xl font-bold">Local Library</h1>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search books, authors..." 
              className="bg-primary-dark focus:ring-2 focus:ring-white/50 rounded-lg px-4 py-2 pl-10 w-64 text-sm text-white placeholder-white/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"></i>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Hi, Pushkar Singh</span>
            <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
              <span className="font-medium text-sm">PS</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
