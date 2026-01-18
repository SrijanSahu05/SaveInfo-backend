import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import noteRouter from './routes/noteRoute.js';
import rateLimiter from './middleware/rateLimiter.js';


//Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


//Middlewares
app.use(
    cors({
        //origin: "http://localhost:5173",
        origin: "https://save-info-frontend.vercel.app",
        credentials: true
    })
)
app.use(express.json());
//app.use(rateLimiter);


//routes
app.use('/SaveInfo/auth', userRouter);
app.use('/SaveInfo/notes', noteRouter);


//Connect to MongoDB then listen on PORT.
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is started on Port:", PORT);
    });
});