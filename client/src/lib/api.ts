import { apiRequest } from "./queryClient";

// We're using our own API endpoints instead of connecting directly to the external service
const API_BASE_URL = "/api";

// Helper function to make GET requests
export async function fetchData(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// Helper function to create new resources
export async function createResource(endpoint: string, data: any) {
  const response = await apiRequest("POST", `${API_BASE_URL}${endpoint}`, data);
  return response.json();
}

// Helper function to update resources
export async function updateResource(endpoint: string, data: any) {
  const response = await apiRequest("PUT", `${API_BASE_URL}${endpoint}`, data);
  return response.json();
}

// Helper function to delete resources
export async function deleteResource(endpoint: string) {
  const response = await apiRequest("DELETE", `${API_BASE_URL}${endpoint}`);
  return response.json();
}

// API endpoints for books
export const booksApi = {
  getAll: () => fetchData("/books"),
  getById: (id: string) => fetchData(`/book/${id}`),
  create: async (data: any) => {
    console.log("Creating book with data:", data);
    try {
      const response = await fetch(`${API_BASE_URL}/book/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Book creation response error:", errorText);
        throw new Error(`Failed to create book: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Book creation success response:", result);
      return result;
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  },
  update: (id: string, data: any) => updateResource(`/book/${id}/update`, data),
  delete: (id: string) => deleteResource(`/book/${id}/delete`),
};

// API endpoints for authors
export const authorsApi = {
  getAll: () => fetchData("/authors"),
  getById: (id: string) => fetchData(`/author/${id}`),
  create: async (data: any) => {
    console.log("Creating author with data:", data);
    try {
      const response = await fetch(`${API_BASE_URL}/author/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Author creation response error:", errorText);
        throw new Error(`Failed to create author: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Author creation success response:", result);
      return result;
    } catch (error) {
      console.error("Error creating author:", error);
      throw error;
    }
  },
  update: (id: string, data: any) => updateResource(`/author/${id}/update`, data),
  delete: (id: string) => deleteResource(`/author/${id}/delete`),
};

// API endpoints for genres
export const genresApi = {
  getAll: () => fetchData("/genres"),
  getById: (id: string) => fetchData(`/genre/${id}`),
  create: async (data: any) => {
    console.log("Creating genre with data:", data);
    try {
      const response = await fetch(`${API_BASE_URL}/genre/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Genre creation response error:", errorText);
        throw new Error(`Failed to create genre: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Genre creation success response:", result);
      return result;
    } catch (error) {
      console.error("Error creating genre:", error);
      throw error;
    }
  },
  update: (id: string, data: any) => updateResource(`/genre/${id}/update`, data),
  delete: (id: string) => deleteResource(`/genre/${id}/delete`),
};

// API endpoints for book instances
export const bookInstancesApi = {
  getAll: () => fetchData("/bookinstances"),
  getById: (id: string) => fetchData(`/bookinstance/${id}`),
  create: async (data: any) => {
    console.log("Creating book instance with data:", data);
    try {
      const response = await fetch(`${API_BASE_URL}/bookinstance/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Book instance creation response error:", errorText);
        throw new Error(`Failed to create book instance: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Book instance creation success response:", result);
      return result;
    } catch (error) {
      console.error("Error creating book instance:", error);
      throw error;
    }
  },
  update: (id: string, data: any) => updateResource(`/bookinstance/${id}/update`, data),
  delete: (id: string) => deleteResource(`/bookinstance/${id}/delete`),
};

// API endpoint for dashboard statistics
export const dashboardApi = {
  getStats: () => fetchData("/stats"),
};
