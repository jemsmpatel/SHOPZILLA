import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    fname: {
        type: String,
        required: false,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    contact: {
        type: Number,
        require: false,
    },

    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;