import cookieParrser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import dbConnection from './utils/index.js';
import cors from 'cors';
import { errorHandler, routeNotFound } from './middleware/errorMiddleware.js';
import routes from './routes/index.js';
import './init.js';

dotenv.config();

dbConnection()


const PORT =process.env.PORT || 5000;
const app = express();

app.use(
    cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
})
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParrser());
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

})