// Update your CSRF type declaration to:
declare module 'csrf-csrf' {
  import { RequestHandler } from 'express';
  
  export function doubleCsrf(options: {
    getSecret: (req?: any) => string;
    cookieName?: string;
    cookieOptions?: {
      httpOnly?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
      secure?: boolean;
    };
    size?: number;
    ignoredMethods?: string[];
  }): {
    generateToken: (req: any, res: any) => string;
    doubleCsrfProtection: RequestHandler; // Use Express's RequestHandler type
  };
}