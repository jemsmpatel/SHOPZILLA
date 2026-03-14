import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const exists = await Admin.findOne({ role: "SUPER_ADMIN" });

        if (exists) {
            console.log("⚠️ Super Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);

        await Admin.create({
            name: "Super Admin",
            email: process.env.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: "SUPER_ADMIN",
            isActive: true,
        });

        console.log("🚀 Super Admin created successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

seedSuperAdmin();
