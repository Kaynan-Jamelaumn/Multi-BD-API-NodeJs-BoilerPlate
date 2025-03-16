// Define a custom interface for the user object
type Role = 'User' | 'Admin';

interface User {
    role: Role;
    [key: string]: any; // Allow additional properties
  }
  