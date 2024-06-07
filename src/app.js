import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from './routes/user.routes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON and URL-encoded form data
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);

// Root route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

export { app };

