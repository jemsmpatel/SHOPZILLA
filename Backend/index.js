// packages
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

// Files
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
import cors from "cors";

// configuration
dotenv.config()
connectDB()

const app = express()

app.use(cors({
    origin: ["http://localhost:3000", "http://10.233.167.181:3000"], // ya 3000 (tumhara frontend port)
    credentials: true
}));

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


const PORT = process.env.PORT || 5000;

// Routes
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

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    // Any route that is not an API route will be redirected to index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
}

app.listen(PORT, ["10.233.167.181", "127.0.0.1"], () => console.log(`server is running on port ${PORT}`));