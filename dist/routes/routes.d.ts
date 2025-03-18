import { Router } from 'express';
declare module 'express' {
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
declare const mainRouter: Router;
export default mainRouter;
