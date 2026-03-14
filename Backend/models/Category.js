import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: false,
        },

        parent_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },

        image: {
            type: String,
            required: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
