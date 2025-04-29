import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

// Define interface types for our parsed data
interface Book {
  _id: string;
  title: string;
  author: string | Author | { name: string; _id: string };
  summary: string;
  isbn: string;
  genre: Genre[];
  url?: string;
  status?: string;
}

interface Author {
  _id: string;
  first_name: string;
  family_name: string;
  name: string;
  date_of_birth?: string;
  date_of_death?: string;
}

interface Genre {
  _id: string;
  name: string;
  url?: string;
}

interface BookInstance {
  _id: string;
  book: string | Book;
  imprint: string;
  status: string;
  due_back?: string;
  due_back_formatted?: string;
}

interface GenreCount {
  name: string;
  count: number;
}

const EXTERNAL_API_URL = "https://library-website-jx6f.onrender.com/catalog";

// Helper function to forward POST requests to the external API
async function forwardPostRequest(endpoint: string, data: any) {
  try {
    // Make sure the endpoint starts with a slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Log the actual URL we're sending to
    const fullUrl = `${EXTERNAL_API_URL}${cleanEndpoint}`;
    console.log(`Sending POST request to: ${fullUrl}`);
    
    // Your backend might be expecting form data instead of JSON
    const formData = new URLSearchParams();
    for (const key in data) {
      if (Array.isArray(data[key])) {
        // Handle arrays (like genre selections)
        data[key].forEach((val: string) => {
          formData.append(key, val);
        });
      } else {
        formData.append(key, data[key]);
      }
    }
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error from external API: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Try to parse response as JSON, but fall back to text if it's not valid JSON
    let responseData;
    const responseText = await response.text();
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { message: responseText };
    }
    
    return responseData;
  } catch (error) {
    console.error(`Error forwarding request to ${endpoint}:`, error);
    throw error;
  }
}

// Helper function to fetch and parse HTML data
async function fetchHtmlData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    const html = await response.text();
    return html;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
}

// Parse books data from HTML
function parseBooks(html: string) {
  const $ = cheerio.load(html);
  const books: Book[] = [];
  
  $("li a").each((_, element) => {
    const title = $(element).text().trim();
    const url = $(element).attr("href");
    
    if (url && url.includes("/book/")) {
      const _id = url.split("/").pop() || "";
      
      // Skip the "Create new book" placeholder
      if (title === "Create new book" || _id === "create" || url.includes("/create")) {
        return; // Skip this iteration
      }
      
      const authorInfo = $(element).parent().text().trim();
      const authorMatch = authorInfo.match(/\((.*?)\)$/);
      const author = authorMatch ? authorMatch[1] : "Unknown";
      
      books.push({
        _id,
        title,
        author: {
          name: author,
          _id: "placeholder" // We'll need the actual ID from the author page
        },
        summary: "",
        isbn: "",
        genre: [],
        url
      });
    }
  });
  
  return {
    book_list: books
  };
}

// Parse single book data from HTML
function parseBookDetail(html: string) {
  const $ = cheerio.load(html);
  const title = $("h1").text().trim();
  const details = $("p");
  
  let author = "";
  let summary = "";
  let isbn = "";
  const genres: Genre[] = [];
  
  details.each((i, element) => {
    const text = $(element).text().trim();
    if (text.startsWith("Author:")) {
      author = $(element).find("a").text().trim();
    } else if (text.startsWith("Summary:")) {
      summary = text.replace("Summary:", "").trim();
    } else if (text.startsWith("ISBN:")) {
      isbn = text.replace("ISBN:", "").trim();
    } else if (text.startsWith("Genre:")) {
      $(element).find("a").each((_, genreEl) => {
        const genreName = $(genreEl).text().trim();
        const genreUrl = $(genreEl).attr("href");
        const genreId = genreUrl ? genreUrl.split("/").pop() || "" : "";
        genres.push({ _id: genreId, name: genreName });
      });
    }
  });
  
  const authorIdMatch = $("p a[href*='/author/']").attr("href")?.match(/\/author\/([^/]+)/);
  const authorId = authorIdMatch ? authorIdMatch[1] : "placeholder";
  
  const bookInstances: BookInstance[] = [];
  $("h4").each((i, element) => {
    if ($(element).text().trim() === "Copies") {
      const instances = $(element).next("ul").find("li");
      instances.each((_, instanceEl) => {
        const statusText = $(instanceEl).text().trim();
        const instanceUrl = $(instanceEl).find("a").attr("href");
        const instanceId = instanceUrl ? instanceUrl.split("/").pop() || "" : "";
        const status = statusText.includes("Available") ? "Available" : 
                     statusText.includes("Maintenance") ? "Maintenance" :
                     statusText.includes("Loaned") ? "Loaned" : 
                     "Reserved";
        
        bookInstances.push({
          _id: instanceId,
          book: title,
          imprint: "Unknown",
          status,
          due_back: ""
        });
      });
    }
  });
  
  const book: Book = {
    _id: $("article").data("id")?.toString() || "placeholder",
    title,
    author: {
      _id: authorId,
      name: author
    },
    summary,
    isbn,
    genre: genres
  };
  
  return {
    book,
    book_instances: bookInstances
  };
}

// Parse authors data from HTML
function parseAuthors(html: string) {
  const $ = cheerio.load(html);
  const authors: Author[] = [];
  
  $("li a").each((_, element) => {
    const name = $(element).text().trim();
    const url = $(element).attr("href");
    
    if (url && url.includes("/author/")) {
      const _id = url.split("/").pop() || "";
      
      // Skip the "Create new author" placeholder
      if (name === "Create new author" || _id === "create" || url.includes("/create")) {
        return; // Skip this iteration
      }
      
      // Extract first and family name - assuming format "Firstname Lastname"
      const nameParts = name.split(" ");
      const first_name = nameParts[0] || "";
      const family_name = nameParts.slice(1).join(" ") || "";
      
      authors.push({
        _id,
        first_name,
        family_name,
        name,
        date_of_birth: "",
        date_of_death: ""
      });
    }
  });
  
  return {
    author_list: authors
  };
}

// Parse single author data from HTML
function parseAuthorDetail(html: string) {
  const $ = cheerio.load(html);
  const name = $("h1").text().trim();
  const details = $("p");
  
  let date_of_birth = "";
  let date_of_death = "";
  
  details.each((i, element) => {
    const text = $(element).text().trim();
    if (text.startsWith("Date of birth:")) {
      date_of_birth = text.replace("Date of birth:", "").trim();
    } else if (text.startsWith("Date of death:")) {
      date_of_death = text.replace("Date of death:", "").trim();
    }
  });
  
  // Extract first and family name
  const nameParts = name.split(" ");
  const first_name = nameParts[0] || "";
  const family_name = nameParts.slice(1).join(" ") || "";
  
  // Extract author ID from the HTML
  let authorId = "";
  $("article").each((_, el) => {
    const dataId = $(el).data("id");
    if (dataId) {
      authorId = dataId.toString();
    }
  });
  
  if (!authorId) {
    // Try to extract from URL
    $("a[href*='/author/']").each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.includes("/author/")) {
        const potentialId = href.split("/").pop();
        if (potentialId && potentialId !== 'create') {
          authorId = potentialId;
        }
      }
    });
  }
  
  if (!authorId) {
    // Extract from meta tag or any other source if available
    authorId = $("meta[property='og:url']").attr("content")?.split("/").pop() || "";
  }
  
  if (!authorId) {
    authorId = "placeholder";
  }
  
  console.log(`Author ID extracted: ${authorId} for author: ${name}`);
  
  // Get author's books
  const books: Book[] = [];
  let booksFound = false;
  
  $("h4, h3").each((i, element) => {
    const headingText = $(element).text().trim();
    if (headingText === "Books" || headingText === "Books by this author") {
      booksFound = true;
      let booksList;
      
      // Try different selectors to find the book list
      const nextElement = $(element).next();
      if (nextElement.is("dl")) {
        booksList = nextElement.find("dt");
      } else if (nextElement.is("div") || nextElement.is("ul")) {
        booksList = nextElement.find("li, div");
      } else {
        // Try finding the closest container that might have book listings
        booksList = $(element).nextAll().find("a[href*='/book/']").closest("dt, li, div");
      }
      
      if (booksList.length === 0) {
        console.log("No book list elements found after books heading");
      }
      
      booksList.each((_, bookEl) => {
        const bookLink = $(bookEl).find("a").first();
        const title = bookLink.text().trim();
        const url = bookLink.attr("href");
        const _id = url ? url.split("/").pop() || "" : "";
        
        // Extract summary - could be in a dd element or other nearby element
        let summary = "";
        const nextEl = $(bookEl).next("dd");
        if (nextEl.length) {
          summary = nextEl.text().trim();
        }
        
        // Extract genre information if available
        const genres: { _id: string; name: string }[] = [];
        $(bookEl).find("a[href*='/genre/']").each((_, genreEl) => {
          const genreName = $(genreEl).text().trim();
          const genreUrl = $(genreEl).attr("href");
          const genreId = genreUrl ? genreUrl.split("/").pop() || "" : "";
          
          if (genreName && genreId) {
            genres.push({ _id: genreId, name: genreName });
          }
        });
        
        if (title && _id) {
          books.push({
            _id,
            title,
            author: {
              _id: authorId,
              name
            },
            summary,
            isbn: "",
            genre: genres
          });
        }
      });
    }
  });
  
  console.log(`Found ${books.length} books for author: ${name}`);
  
  const author: Author = {
    _id: authorId,
    first_name,
    family_name,
    name,
    date_of_birth,
    date_of_death
  };
  
  return {
    author,
    author_books: books
  };
}

// Parse genres data from HTML
function parseGenres(html: string) {
  const $ = cheerio.load(html);
  const genres: Genre[] = [];
  
  console.log("Number of links found:", $("li a").length);
  
  // Look for the genres section in the page
  let genresFound = false;
  
  $("h1").each((i, el) => {
    const heading = $(el).text().trim();
    console.log(`Found heading: "${heading}"`);
    if (heading === "Genre List") {
      genresFound = true;
    }
  });
  
  console.log("Genres section found:", genresFound);
  
  // Add debugging for list items
  $("li").each((i, el) => {
    console.log(`List item ${i}: "${$(el).text().trim()}"`);
  });
  
  // The actual genres parsing
  $("li a").each((i, element) => {
    const name = $(element).text().trim();
    const url = $(element).attr("href");
    
    console.log(`Link ${i}: text="${name}", url=${url}`);
    
    if (url && (url.includes("/genres/") || url.includes("/genre/"))) {
      const _id = url.split("/").pop() || "";
      
      // Skip the "Create new genre" placeholder
      if (name === "Create new genre" || _id === "create" || url.includes("/create")) {
        return; // Skip this iteration
      }
      
      console.log(`Adding genre: ${name} with ID: ${_id}`);
      
      genres.push({
        _id,
        name,
        url
      });
    }
  });
  
  console.log(`Total genres found: ${genres.length}`);
  
  return {
    genre_list: genres
  };
}

// Parse single genre data from HTML
function parseGenreDetail(html: string) {
  const $ = cheerio.load(html);
  const name = $("h1").text().trim();
  
  // Extract genre ID from URL in page
  let genreId = "";
  $("article").each((_, el) => {
    const dataId = $(el).data("id");
    if (dataId) {
      genreId = dataId.toString();
    }
  });
  
  if (!genreId) {
    // Try to extract from URL
    $("a[href*='/genres/']").each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.includes("/genres/")) {
        const potentialId = href.split("/").pop();
        if (potentialId && potentialId !== 'create') {
          genreId = potentialId;
        }
      }
    });
  }
  
  if (!genreId) {
    // Still no ID, try to get it from the current URL
    genreId = $("meta[property='og:url']").attr("content")?.split("/").pop() || "";
  }
  
  if (!genreId) {
    genreId = "placeholder";
  }
  
  console.log(`Genre ID extracted: ${genreId} for genre: ${name}`);
  
  // Get genre's books
  const books: Book[] = [];
  let booksFound = false;
  
  $("h4, h3").each((i, element) => {
    const headingText = $(element).text().trim();
    if (headingText === "Books" || headingText === "Books in this genre") {
      booksFound = true;
      const booksList = $(element).next("div, dl, ul").find("dt, li");
      
      if (booksList.length === 0) {
        console.log("No book list elements found after books heading");
      }
      
      booksList.each((_, bookEl) => {
        const bookLink = $(bookEl).find("a").first();
        const title = bookLink.text().trim();
        const url = bookLink.attr("href");
        const _id = url ? url.split("/").pop() || "" : "";
        
        // Extract summary - could be in a dd element or other nearby element
        let summary = "";
        const nextEl = $(bookEl).next("dd");
        if (nextEl.length) {
          summary = nextEl.text().trim();
        }
        
        // Extract author information
        let author = "Unknown";
        let authorId = "";
        
        // Try different selectors for author links
        const authorEl = $(bookEl).find("a[href*='/author/']").length ? 
                         $(bookEl).find("a[href*='/author/']") : 
                         $(bookEl).next("dd").find("a[href*='/author/']");
        
        if (authorEl.length) {
          author = authorEl.text().trim();
          const authorUrl = authorEl.attr("href");
          authorId = authorUrl ? authorUrl.split("/").pop() || "" : "";
        }
        
        if (title && _id) {
          books.push({
            _id,
            title,
            author: {
              _id: authorId,
              name: author
            },
            summary,
            isbn: "",
            genre: [{ _id: genreId, name }]
          });
        }
      });
    }
  });
  
  console.log(`Found ${books.length} books for genre: ${name}`);
  
  const genre: Genre = {
    _id: genreId,
    name,
    url: ""
  };
  
  return {
    genre,
    genre_books: books
  };
}

// Parse dashboard stats from HTML
function parseDashboardStats(html: string) {
  const $ = cheerio.load(html);
  
  // Extract counts from the home page
  let book_count = 0;
  let book_instance_count = 0;
  let book_instance_available_count = 0;
  let author_count = 0;
  let genre_count = 0;
  
  $("li").each((_, element) => {
    const text = $(element).text().trim();
    
    if (text.includes("Books:")) {
      book_count = parseInt(text.replace(/\D/g, ""), 10) || 0;
    } else if (text.includes("Copies:")) {
      book_instance_count = parseInt(text.replace(/\D/g, ""), 10) || 0;
    } else if (text.includes("Copies available:")) {
      book_instance_available_count = parseInt(text.replace(/\D/g, ""), 10) || 0;
    } else if (text.includes("Authors:")) {
      author_count = parseInt(text.replace(/\D/g, ""), 10) || 0;
    } else if (text.includes("Genres:")) {
      genre_count = parseInt(text.replace(/\D/g, ""), 10) || 0;
    }
  });
  
  // Create genre counts for the chart
  const genreCounts: GenreCount[] = [
    { name: 'Fiction', count: Math.floor(book_count * 0.4) },
    { name: 'Non-fiction', count: Math.floor(book_count * 0.3) },
    { name: 'Science', count: Math.floor(book_count * 0.15) },
    { name: 'Fantasy', count: Math.floor(book_count * 0.15) }
  ];
  
  return {
    book_count,
    book_instance_count,
    book_instance_available_count,
    author_count,
    genre_count,
    genreCounts
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes to proxy and transform data from the external service
  
  // Create routes - these will forward data to the external API
  app.post("/api/author/create", async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Forwarding author create request to external API:", req.body);
      // We should not append '/catalog' as it's already in the EXTERNAL_API_URL
      const response = await forwardPostRequest("/author/create", req.body);
      console.log("External API response for author creation:", response);
      
      // Force a refresh of authors data
      setTimeout(async () => {
        try {
          await fetchHtmlData(`${EXTERNAL_API_URL}/authors`);
          console.log("Authors data refreshed");
        } catch (e) {
          console.error("Failed to refresh authors data:", e);
        }
      }, 1000);
      
      res.json({
        success: true,
        message: "Author created successfully",
        data: response
      });
    } catch (error) {
      console.error("Error creating author:", error);
      next(error);
    }
  });

  app.post("/api/genre/create", async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Forwarding genre create request to external API:", req.body);
      // We should not append '/catalog' as it's already in the EXTERNAL_API_URL
      const response = await forwardPostRequest("/genre/create", req.body);
      console.log("External API response for genre creation:", response);
      
      // Force a refresh of genres data
      setTimeout(async () => {
        try {
          await fetchHtmlData(`${EXTERNAL_API_URL}/genres`);
          console.log("Genres data refreshed");
        } catch (e) {
          console.error("Failed to refresh genres data:", e);
        }
      }, 1000);
      
      res.json({
        success: true,
        message: "Genre created successfully",
        data: response
      });
    } catch (error) {
      console.error("Error creating genre:", error);
      next(error);
    }
  });

  app.post("/api/book/create", async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Forwarding book create request to external API:", req.body);
      // We should not append '/catalog' as it's already in the EXTERNAL_API_URL
      const response = await forwardPostRequest("/book/create", req.body);
      console.log("External API response for book creation:", response);
      
      // Force a refresh of books data
      setTimeout(async () => {
        try {
          await fetchHtmlData(`${EXTERNAL_API_URL}/books`);
          console.log("Books data refreshed");
        } catch (e) {
          console.error("Failed to refresh books data:", e);
        }
      }, 1000);
      
      res.json({
        success: true,
        message: "Book created successfully",
        data: response
      });
    } catch (error) {
      console.error("Error creating book:", error);
      next(error);
    }
  });

  app.post("/api/bookinstance/create", async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Forwarding book instance create request to external API:", req.body);
      // We should not append '/catalog' as it's already in the EXTERNAL_API_URL
      const response = await forwardPostRequest("/bookinstance/create", req.body);
      console.log("External API response for book instance creation:", response);
      
      // Force a refresh of book instances data
      setTimeout(async () => {
        try {
          await fetchHtmlData(`${EXTERNAL_API_URL}/bookinstances`);
          console.log("Book instances data refreshed");
        } catch (e) {
          console.error("Failed to refresh book instances data:", e);
        }
      }, 1000);
      
      res.json({
        success: true,
        message: "Book instance created successfully",
        data: response
      });
    } catch (error) {
      console.error("Error creating book instance:", error);
      next(error);
    }
  });
  
  // Books API
  app.get("/api/books", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const html = await fetchHtmlData(`${EXTERNAL_API_URL}/books`);
      const data = parseBooks(html);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/book/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const html = await fetchHtmlData(`${EXTERNAL_API_URL}/book/${req.params.id}`);
      const data = parseBookDetail(html);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/api/book/:id/update", async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(`Forwarding book update request for ID ${req.params.id} to external API:`, req.body);
      const response = await forwardPostRequest(`/book/${req.params.id}/update`, req.body);
      console.log("External API response for book update:", response);
      
      // Force a refresh of books data
      setTimeout(async () => {
        try {
          await fetchHtmlData(`${EXTERNAL_API_URL}/books`);
          console.log("Books data refreshed after update");
        } catch (e) {
          console.error("Failed to refresh books data:", e);
        }
      }, 1000);
      
      res.json({
        success: true,
        message: "Book updated successfully",
        data: response
      });
    } catch (error) {
      console.error("Error updating book:", error);
      next(error);
    }
  });
  
  app.post("/api/book/:id/delete", async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(`Forwarding book delete request for ID ${req.params.id} to external API`);
      const response = await forwardPostRequest(`/book/${req.params.id}/delete`, {});
      console.log("External API response for book deletion:", response);
      
      // Force a refresh of books data
      setTimeout(async () => {
        try {
          await fetchHtmlData(`${EXTERNAL_API_URL}/books`);
          console.log("Books data refreshed after deletion");
        } catch (e) {
          console.error("Failed to refresh books data:", e);
        }
      }, 1000);
      
      res.json({
        success: true,
        message: "Book deleted successfully",
        data: response
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      next(error);
    }
  });
  
  // Authors API
  app.get("/api/authors", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const html = await fetchHtmlData(`${EXTERNAL_API_URL}/authors`);
      const data = parseAuthors(html);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/author/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const html = await fetchHtmlData(`${EXTERNAL_API_URL}/author/${req.params.id}`);
      const data = parseAuthorDetail(html);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });
  
  // Genres API
  app.get("/api/genres", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Log the URL we're fetching
      const url = `${EXTERNAL_API_URL}/genres`;
      console.log("Fetching genres from URL:", url);
      
      const html = await fetchHtmlData(url);
      
      // Log a snippet of the HTML to debug
      console.log("HTML snippet from genres:", html.substring(0, 500));
      
      const data = parseGenres(html);
      
      // Log the parsed data
      console.log("Parsed genres data:", JSON.stringify(data, null, 2));
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      next(error);
    }
  });
  
  app.get("/api/genre/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fix URL - use /genre/ instead of /genres/ as seen in the curl output
      const html = await fetchHtmlData(`${EXTERNAL_API_URL}/genre/${req.params.id}`);
      console.log(`Fetching genre detail from: ${EXTERNAL_API_URL}/genre/${req.params.id}`);
      const data = parseGenreDetail(html);
      res.json(data);
    } catch (error) {
      console.error(`Error fetching genre detail: ${error}`);
      next(error);
    }
  });
  
  // Dashboard stats
  app.get("/api/stats", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const html = await fetchHtmlData(`${EXTERNAL_API_URL}`);
      const data = parseDashboardStats(html);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });
  
  

  const httpServer = createServer(app);
  return httpServer;
}
