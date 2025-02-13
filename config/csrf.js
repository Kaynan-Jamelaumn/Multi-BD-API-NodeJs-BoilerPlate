// config/csrf.js
import { doubleCsrf } from "csrf-csrf";
import crypto from "crypto";

export function setupCSRFProtection(app) {
    const { generateToken, doubleCsrfProtection } = doubleCsrf({
        getSecret: (req) => req.session.csrfSecret,
        cookieName: "csrf-token",
        cookieOptions: {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        },
        size: 64,
        ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    });

    app.use((req, res, next) => {
        if (!req.session.csrfSecret) {
            req.session.csrfSecret = crypto.randomBytes(32).toString("hex");
            req.session.save((err) => {
                if (err) return next(err);
                next();
            });
        } else {
            next();
        }
    });

    app.use(doubleCsrfProtection);
    app.use((req, res, next) => {
        res.locals.csrfToken = generateToken(req, res);
        next();
    });
}