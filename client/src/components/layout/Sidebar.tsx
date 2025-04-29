import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };
  
  const linkClasses = (path: string) => cn(
    "flex items-center space-x-2 px-2 py-2 rounded-lg transition-colors",
    isActive(path) 
      ? "bg-primary/10 text-primary font-medium" 
      : "hover:bg-slate-100 text-slate-700"
  );
  
  return (
    <>
      <aside 
        className={cn(
          "bg-white shadow-md w-64 fixed inset-y-0 left-0 transform transition-transform duration-200 ease-in-out z-20 pt-16",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <nav className="px-4 py-6">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-2 pl-2">Menu</p>
            <ul className="space-y-1">
              <li>
                <Link href="/" onClick={closeSidebar} className={linkClasses("/")}>
                  <i className="fas fa-home w-5 text-center"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/books" onClick={closeSidebar} className={linkClasses("/books")}>
                  <i className="fas fa-book w-5 text-center"></i>
                  <span>Books</span>
                </Link>
              </li>
              <li>
                <Link href="/authors" onClick={closeSidebar} className={linkClasses("/authors")}>
                  <i className="fas fa-user-edit w-5 text-center"></i>
                  <span>Authors</span>
                </Link>
              </li>
              <li>
                <Link href="/genres" onClick={closeSidebar} className={linkClasses("/genres")}>
                  <i className="fas fa-tag w-5 text-center"></i>
                  <span>Genres</span>
                </Link>
              </li>
              <li>
                <Link href="/bookinstances" onClick={closeSidebar} className={linkClasses("/bookinstances")}>
                  <i className="fas fa-copy w-5 text-center"></i>
                  <span>Book Copies</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-2 pl-2">Management</p>
            <ul className="space-y-1">
              <li>
                <Link href="/add-book" onClick={closeSidebar} className={linkClasses("/add-book")}>
                  <i className="fas fa-plus-circle w-5 text-center"></i>
                  <span>Add Book</span>
                </Link>
              </li>
              <li>
                <Link href="/create-author" onClick={closeSidebar} className={linkClasses("/create-author")}>
                  <i className="fas fa-user-plus w-5 text-center"></i>
                  <span>Create Author</span>
                </Link>
              </li>
              <li>
                <Link href="/create-genre" onClick={closeSidebar} className={linkClasses("/create-genre")}>
                  <i className="fas fa-tag w-5 text-center"></i>
                  <span>Create Genre</span>
                </Link>
              </li>
              <li>
                <Link href="/create-bookinstance" onClick={closeSidebar} className={linkClasses("/create-bookinstance")}>
                  <i className="fas fa-copy w-5 text-center"></i>
                  <span>Create Book Copy</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-2 pl-2">Help</p>
            <ul className="space-y-1">
              <li>
                <Link href="/settings" onClick={closeSidebar} className={linkClasses("/settings")}>
                  <i className="fas fa-cog w-5 text-center"></i>
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <Link href="/help" onClick={closeSidebar} className={linkClasses("/help")}>
                  <i className="fas fa-question-circle w-5 text-center"></i>
                  <span>Help & Support</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-10 md:hidden" 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
