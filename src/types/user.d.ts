import { Date } from "mongoose";

// Define a custom interface for the user object
export type Role = 'User' | 'Admin';


export const isUser = (data: any): data is User => {
  return data && typeof data.role === 'string' && data.role as Role; 
};

export interface User {
    [key: string]: any; // Allow additional properties
  }
  

  export interface UserDataToBeValidated {
    role?: Role;
    username?: string;
    name?: string;
    surname?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    password?: string;
    bio?: string;
    profilePicture?: string;
    birthDate?: Date;
    isActive?: string;
  }
  
