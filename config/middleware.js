// config/middlewares.js
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupGlobalMiddlewaresAndRoutes(app, port) {
    app.use(helmet());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static("./public"));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    });
    app.use(limiter);

    app.use(
        cors({
            origin: process.env.FRONTEND_URL || `http://localhost:${port}`,
            credentials: true,
        })
    );

    app.set("views", path.resolve(__dirname, "src", "views"));
    app.set("view engine", "ejs");

    app.use(middleWareGlobal);
    app.use(checkCSRFError);
    app.use(mainRouter);
}