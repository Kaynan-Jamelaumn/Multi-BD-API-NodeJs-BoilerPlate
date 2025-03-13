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