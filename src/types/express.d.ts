
// src/types/express.d.ts
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';


// Extend the Session interface to include `csrfSecret`
declare module "express-session" {
    interface Session {
        csrfSecret: string;
        nome?: string; // Add 'nome' property for testMiddleware

    }
}

declare global {
    namespace Express {
      interface Request {
        db: {
          DB_TYPE: string;
          mongoose?: {
            connection: {
              readyState: number;
            };
          };
          sequelize?: {
            authenticate: () => Promise<void>;
          };
        };
      }
    }
  }
  
