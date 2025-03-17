// Define a custom interface for the user object
type Role = 'User' | 'Admin';

interface User {
    [key: string]: any; // Allow additional properties
  }
  