// packages
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

// files
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import mediaRouters from './routes/mediaRouters.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminsellerRoutes from './routes/adminsellerRoutes.js';
import adminuserRoutes from './routes/adminuserRoutes.js';
import adminproductRouter from './routes/adminproductRouter.js';
import adminorderRoutes from './routes/adminorderRoutes.js';

// __dirname fix (ESM)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// config
dotenv.config();

// app init
const app = express();

// middlewares
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// DB + server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        // API routes
        app.use('/api/v1/users', userRoutes);
        app.use('/api/v1/sellers', sellerRoutes);
        app.use('/api/v1/products', productsRoutes);
        app.use('/api/v1/cart', cartRoutes);
        app.use('/api/v1/category', categoryRoutes);
        app.use('/api/v1/media', mediaRouters);
        app.use('/api/v1/order', orderRoutes);
        app.use('/api/v1/admin', adminRoutes);
        app.use('/api/v1/admin/seller', adminsellerRoutes);
        app.use('/api/v1/admin/user', adminuserRoutes);
        app.use('/api/v1/admin/products', adminproductRouter);
        app.use('/api/v1/admin/orders', adminorderRoutes);

        // 🔥 Serve React frontend
        app.use(express.static(path.join(__dirname, '../frontend/build')));

        // ⚠️ IMPORTANT fallback (fixes Unexpected token <)
        app.use((req, res, next) => {
            if (req.path.startsWith('/api')) {
                return res.status(404).json({ message: "API route not found" });
            }
            res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Server failed:", error.message);
    }
};

startServer();
