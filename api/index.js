import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import connectDB from '../backend/config/db.config.js'; // Perhatikan path '../backend'
import { configurePassport } from '../backend/config/passport.config.js';

// Import Routes dari folder backend
import authRoutes from '../backend/routes/auth.routes.js';
import materiRoutes from '../backend/routes/materi.routes.js';
import userRoutes from '../backend/routes/user.routes.js';
import threadRoutes from '../backend/routes/thread.routes.js';
import replyRoutes from '../backend/routes/reply.routes.js';
import feedbackRoutes from '../backend/routes/feedback.routes.js';
import submissionRoutes from '../backend/routes/submission.routes.js';
import configRoutes from '../backend/routes/config.routes.js';
import chatTemplateRoutes from '../backend/routes/chatTemplate.routes.js';

const app = express();

// Connect Database
connectDB();
configurePassport(passport);

app.use(cors({
    origin: "*", // Izinkan akses dari mana saja (penting untuk Vercel)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
app.use(express.json());
app.use(passport.initialize());

// Route Dasar untuk Cek Server
app.get('/', (req, res) => {
    res.send('ADCOM Server is Running...');
});

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/materi', materiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/replies', replyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/config', configRoutes);
app.use('/api/chat-templates', chatTemplateRoutes);

// Export app untuk Vercel Serverless
export default app;

// Jalankan server lokal jika bukan di Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}