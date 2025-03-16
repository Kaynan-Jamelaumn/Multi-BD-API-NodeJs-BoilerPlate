
// src/types/express.d.ts
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';


// Extend the Session interface to include `csrfSecret`
declare module "express-session" {
    interface Session {
        csrfSecret: string;
    }
}

declare global {
    namespace Express {
      interface Request {
        db?: {
          mongoose: mongoose.Connection;
          sequelize: any;
          DB_TYPE: string;
        };
        user?: User;
      } 
    }
  }
  
