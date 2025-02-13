// config/session.js
import session from "express-session";
import MongoStore from "connect-mongo";
import connectSessionSequelize from "connect-session-sequelize";

export function setupSessionAndFlash(app, DB_TYPE, mongooseConnection, sequelize) {
    let store;

    if (DB_TYPE === "mongo") {
        store = MongoStore.create({
            client: mongooseConnection.getClient(),
            dbName: mongooseConnection.name,
            collectionName: "sessions",
        });
    } else if (DB_TYPE === "mysql") {
        const SequelizeStore = connectSessionSequelize(session.Store);
        store = new SequelizeStore({
            db: sequelize,
            tableName: "sessions",
        });
    }

    const sessionOptions = session({
        secret: process.env.SESSIONSECRET || "defaultsecret",
        store: store,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 31,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        },
    });

    app.use(sessionOptions);
    app.use(flash());
}