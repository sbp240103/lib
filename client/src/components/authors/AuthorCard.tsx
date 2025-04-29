import { Link } from "wouter";
import { Author } from "@/types";

interface AuthorCardProps {
  author: Author;
  bookCount?: number;
}

export default function AuthorCard({ author, bookCount = 0 }: AuthorCardProps) {
  // Generate initials from author name
  const getInitials = () => {
    if (author.first_name && author.family_name) {
      return `${author.first_name.charAt(0)}${author.family_name.charAt(0)}`;
    }
    return author.name?.split(' ').map(n => n.charAt(0)).join('') || 'AU';
  };
  
  // Determine background color based on first letter of name
  const getColorClass = () => {
    const firstChar = author.first_name?.charAt(0).toLowerCase() || 
                      author.name?.charAt(0).toLowerCase() || 'a';
    
    // Map the first character to a color class
    const charCode = firstChar.charCodeAt(0) - 'a'.charCodeAt(0);
    switch (charCode % 3) {
      case 0: return "bg-primary/10 text-primary";
      case 1: return "bg-secondary/10 text-secondary";
      case 2: return "bg-warning/10 text-warning";
      default: return "bg-primary/10 text-primary";
    }
  };
  
  // Format birth/death dates
  const formatBirthDeathDate = () => {
    if (author.date_of_birth && author.date_of_death) {
      return `${formatDate(author.date_of_birth)} - ${formatDate(author.date_of_death)}`;
    } else if (author.date_of_birth) {
      return `Born: ${formatDate(author.date_of_birth)}`;
    }
    return 'No birth date information';
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Determine author type/genre
  const getAuthorType = () => {
    // This is just a placeholder, in a real application you might want to
    // determine this based on the genres of the author's books
    return "Author";
  };
  
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-14 h-14 ${getColorClass()} rounded-full flex items-center justify-center text-xl`}>
            <span className="font-medium">{getInitials()}</span>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-slate-800">{author.name}</h3>
            <p className="text-sm text-slate-500">{getAuthorType()}</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            <i className="fas fa-calendar-alt w-5 text-slate-400"></i>
            <span className="ml-2">{formatBirthDeathDate()}</span>
          </div>
          <div className="flex items-center text-sm">
            <i className="fas fa-book w-5 text-slate-400"></i>
            <span className="ml-2">{bookCount} {bookCount === 1 ? 'book' : 'books'} in library</span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Link href={`/author/${author._id}`} className="text-primary hover:text-primary-dark text-sm font-medium hover:underline">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
