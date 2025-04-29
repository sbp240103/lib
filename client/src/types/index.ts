// API Response Types - these might need to be adjusted based on the actual API responses

// Book type
export interface Book {
  _id: string;
  title: string;
  author: string | Author;
  summary: string;
  isbn: string;
  genre: Genre[];
  status?: string;
  series?: string;
  book_instances?: BookInstance[];
}

// Author type
export interface Author {
  _id: string;
  first_name?: string;
  family_name?: string;
  name?: string;
  date_of_birth?: string;
  date_of_death?: string;
}

// Genre type
export interface Genre {
  _id: string;
  name: string;
  url?: string;
}

// BookInstance type
export interface BookInstance {
  _id: string;
  book: string | Book;
  imprint: string;
  status: string;
  due_back?: string;
  due_back_formatted?: string;
  url?: string;
}

// Dashboard statistics
export interface DashboardStats {
  book_count: number;
  book_instance_count: number;
  book_instance_available_count: number;
  author_count: number;
  genre_count: number;
  genreCounts: GenreCount[];
}

// For genre distribution charts
export interface GenreCount {
  name: string;
  count: number;
}

// For book status counts
export interface BookStatusCount {
  status: string;
  count: number;
}

// Transform functions to handle API responses

// Transform dashboard data
export function transformDashboardData(data: any): DashboardStats {
  // Create genre counts for visualization
  // This is just a placeholder - in a real app, you'd get this from the API
  const genreCounts: GenreCount[] = [
    { name: 'Fantasy', count: 3 },
    { name: 'Science Fiction', count: 2 },
    { name: 'French Poetry', count: 1 },
    { name: 'Others', count: 1 }
  ];

  return {
    book_count: data.book_count || 0,
    book_instance_count: data.book_instance_count || 0,
    book_instance_available_count: data.book_instance_available_count || 0,
    author_count: data.author_count || 0,
    genre_count: data.genre_count || 0,
    genreCounts
  };
}

// Transform books listing data
export function transformBooksData(data: any): Book[] {
  if (!data.book_list) return [];
  
  return data.book_list.map((book: any) => ({
    _id: book._id,
    title: book.title,
    author: book.author,
    summary: book.summary,
    isbn: book.isbn,
    genre: book.genre || [],
    status: getRandomStatus() // This would normally come from book instances
  }));
}

// Transform single book data
export function transformBookData(data: any): Book {
  return {
    _id: data.book._id,
    title: data.book.title,
    author: data.book.author,
    summary: data.book.summary,
    isbn: data.book.isbn,
    genre: data.book.genre || [],
    book_instances: data.book_instances || []
  };
}

// Transform book instances data
export function transformBookInstancesData(data: any): BookInstance[] {
  if (!data.bookinstance_list) return [];
  
  return data.bookinstance_list.map((instance: any) => ({
    _id: instance._id,
    book: instance.book,
    imprint: instance.imprint,
    status: instance.status,
    due_back: instance.due_back,
    due_back_formatted: instance.due_back_formatted
  }));
}

// Transform authors listing data
export function transformAuthorsData(data: any): Author[] {
  if (!data.author_list) return [];
  
  return data.author_list.map((author: any) => ({
    _id: author._id,
    first_name: author.first_name,
    family_name: author.family_name,
    name: author.name || `${author.first_name} ${author.family_name}`,
    date_of_birth: author.date_of_birth,
    date_of_death: author.date_of_death
  }));
}

// Transform single author data
export function transformAuthorData(data: any): Author {
  const author = data.author;
  return {
    _id: author._id,
    first_name: author.first_name,
    family_name: author.family_name,
    name: author.name || `${author.first_name} ${author.family_name}`,
    date_of_birth: author.date_of_birth,
    date_of_death: author.date_of_death
  };
}

// Transform genres listing data
export function transformGenresData(data: any): Genre[] {
  if (!data.genre_list) return [];
  
  return data.genre_list.map((genre: any) => ({
    _id: genre._id,
    name: genre.name,
    url: genre.url
  }));
}

// Transform single genre data
export function transformGenreData(data: any): Genre {
  return {
    _id: data.genre._id,
    name: data.genre.name,
    url: data.genre.url
  };
}

// Helper function to generate random statuses for demo purposes
// In a real app, this would come from the book instances
function getRandomStatus(): string {
  const statuses = ['Available', 'Loaned', 'Maintenance', 'Reserved'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}
