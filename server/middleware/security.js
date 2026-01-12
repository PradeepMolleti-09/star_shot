import rateLimit from "express-rate-limit";
import helmet from "helmet";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

export const secureHeaders = helmet();