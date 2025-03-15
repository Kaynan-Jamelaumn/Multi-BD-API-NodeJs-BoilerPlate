// src/types/global.d.ts

declare module 'connect-session-sequelize' {
    import { Sequelize } from 'sequelize';
    import session from 'express-session';
  
    interface SequelizeStoreOptions {
      db: Sequelize;
      tableName?: string;
    }
  
    class SequelizeStore extends session.Store {
      constructor(options: SequelizeStoreOptions);
      sync(): Promise<void>;
    }
  
    export default function init(store: typeof session.Store): typeof SequelizeStore;
  }
  
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
      doubleCsrfProtection: RequestHandler;
    };
  }
  
  declare module '*.js' {
    const value: unknown;
    export default value;
  }
  
  declare module 'socket.io/dist/typed-events' {
    interface DefaultEventsMap {
      [event: string]: (...args: unknown[]) => void;
    }
  }