import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// import authRoutes from './routes/authRoutes.js';
// import interviewRoutes from './routes/interviewRoutes.js';
// import templateRoutes from './routes/templateRoutes.js';
// import questionBankRoutes from './routes/questionBankRoutes.js';



dotenv.config();
connectDB();

const app = express();

//security
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

// Rate limiting
const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: 'Too many requests, please try again later'
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ message: 'Algora.ai API running 🚀' }));

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/interview', interviewRoutes);
// app.use('/api/templates', templateRoutes);
// app.use('/api/questions', questionBankRoutes);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));