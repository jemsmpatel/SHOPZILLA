import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/Product.js";
import OrderItem from "../models/OrderItem.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {
    const {
        seller_id,
        name,
        description,
        mrp_price,
        price,
        category_id,
        stock,
        sku,
        tax,
        brand,
        images,
    } = req.body;

    // ✅ Validate required fields (discount_rate hata diya)
    if (
        !seller_id ||
        !name ||
        !description ||
        !mrp_price ||
        !price ||
        !category_id ||
        !stock ||
        !sku ||
        !tax ||
        !brand ||
        !images
    ) {
        res.status(400);
        throw new Error("Please fill all required product fields");
    }

    // ✅ Price validation
    if (Number(price) > Number(mrp_price)) {
        res.status(400);
        throw new Error("Selling price cannot be greater than MRP");
    }

    if (mrp_price <= 0 || price <= 0) {
        throw new Error("Price must be greater than 0");
    }

    // ✅ SKU must be unique
    const productExists = await Product.findOne({ sku });
    if (productExists) {
        res.status(400);
        throw new Error("Product with this SKU already exists");
    }

    // ✅ Create product
    const product = await Product.create({
        seller_id,
        name,
        description,
        mrp_price,
        price,
        discount_rate, // 👈 auto calculated
        category_id,
        stock,
        sku,
        tax,
        brand,
        images,
    });

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
});

const getSpesificProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    // ✅ Validate MongoDB ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }

    // ✅ Find product by ID
    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // ✅ Success response
    res.status(200).json({
        success: true,
        product,
    });
});

const updateSpesificProduct = asyncHandler(async (req, res) => {

    const productId = req.params.id;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    const {
        name,
        description,
        mrp_price,
        price,
        category_id,
        stock,
        sku,
        tax,
        brand,
        images
    } = req.body;

    // ✅ Price validation
    if (Number(price) > Number(mrp_price)) {
        res.status(400);
        throw new Error("Selling price cannot be greater than MRP");
    }

    if (mrp_price <= 0 || price <= 0) {
        throw new Error("Price must be greater than 0");
    }

    // ✅ SKU unique check (exclude current product)
    if (sku) {
        const skuExists = await Product.findOne({
            sku,
            _id: { $ne: productId }
        });

        if (skuExists) {
            res.status(400);
            throw new Error("Product with this SKU already exists");
        }
    }

    // ✅ Calculate discount automatically
    let discount_rate = product.discount_rate;

    const finalPrice = price ?? product.price;
    const finalMrp = mrp_price ?? product.mrp_price;

    if (finalMrp && finalPrice) {
        discount_rate = Math.round(
            ((finalMrp - finalPrice) / finalMrp) * 100
        );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            name: name ?? product.name,
            description: description ?? product.description,
            mrp_price: finalMrp,
            price: finalPrice,
            discount_rate,
            category_id: category_id ?? product.category_id,
            stock: stock ?? product.stock,
            sku: sku ?? product.sku,
            tax: tax ?? product.tax,
            brand: brand ?? product.brand,
            images: images ?? product.images
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
    });

});

const toggleProductStatus = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // Toggle
    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
        success: true,
        message: `Product ${product.isActive ? "activated" : "deactivated"} successfully`,
        product,
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    // Validate ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400);
        throw new Error("Invalid product ID");
    }

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // 🔐 Seller ownership check (recommended)
    if (product.seller_id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this product");
    }

    // ✅ Soft delete → set null
    product.isActive = null;
    await product.save();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully (soft delete)",
        product,
    });
});

const getAllProduct = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const type = req.query.type;

    // 🔎 Search
    const keyword = req.query.keyword
        ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { brand: { $regex: req.query.keyword, $options: "i" } },
            ],
        }
        : {};

    // 🎯 Base Filter
    const filter = {
        ...keyword,
        ...(req.query.isActive && {
            isActive: req.query.isActive === "true",
        }),
    };

    // ✅ CATEGORY + SUBCATEGORY LOGIC
    if (req.query.category_id) {
        const categoryId = new mongoose.Types.ObjectId(
            req.query.category_id
        );

        // recursive function
        const getSubCategories = async (parentId) => {
            const children = await Category.find({
                parent_id: parentId,
            }).select("_id");

            let ids = children.map((c) => c._id);

            for (let child of children) {
                const subIds = await getSubCategories(child._id);
                ids = ids.concat(subIds);
            }

            return ids;
        };

        const subCategoryIds = await getSubCategories(categoryId);

        filter.category_id = {
            $in: [categoryId, ...subCategoryIds],
        };
    }

    // 🔃 Default Sorting
    let sortBy = { createdAt: -1 };

    // 🎯 SECTION BASED LOGIC
    if (type === "hot_deals") {
        filter.discount_rate = { $gte: 10 };
        sortBy = { discount_rate: -1 };
    }

    if (type === "trending") {
        sortBy = { numReviews: -1 };
    }

    if (type === "new_arrivals") {
        sortBy = { createdAt: -1 };
    }

    if (type === "best_sellers") {
        sortBy = { rating: -1 };
    }

    // 🔃 Manual Sort (override)
    if (req.query.sort === "price_asc") sortBy = { price: 1 };
    if (req.query.sort === "price_desc") sortBy = { price: -1 };
    if (req.query.sort === "rating") sortBy = { rating: -1 };

    // 📦 Fetch Products
    const products = await Product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit);

    // 🔢 Total Count
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
        success: true,
        type: type || "all",
        totalProducts,
        page,
        totalPages: Math.ceil(totalProducts / limit),
        products,
    });
});

const getSellerAllProducts = asyncHandler(async (req, res) => {

    const sellerId = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!sellerId) {
        res.status(401);
        throw new Error("Not authorized, seller not found in token");
    }

    const filter = {
        seller_id: sellerId,
        isActive: { $ne: null }
    };

    const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
        success: true,
        seller_id: sellerId,
        totalProducts,
        page,
        totalPages: Math.ceil(totalProducts / limit),
        products,
    });
});

const createProductReview = asyncHandler(async (req, res) => {

    const productId = req.params.id;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    if (rating === undefined || !comment) {
        res.status(400);
        throw new Error("Rating and comment are required");
    }

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }


    // ✅ CHECK USER PURCHASED AND PRODUCT IS DELIVERED

    const deliveredItem = await OrderItem.findOne({
        product_id: productId,
        item_status: "delivered",
    }).populate({
        path: "order_id",
        match: { user_id: userId }
    });

    if (!deliveredItem || !deliveredItem.order_id) {
        res.status(400);
        throw new Error("You can review only delivered products you purchased");
    }


    // ✅ DUPLICATE REVIEW CHECK

    const alreadyReviewed = product.reviews.find(
        (r) => r?.user && r.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
        res.status(400);
        throw new Error("You are already reviewed in this product");
    }


    // ✅ CREATE REVIEW

    const review = {
        rating: Number(rating),
        comment,
        user: userId,
        createdAt: new Date(),
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    // important for Mixed type
    product.markModified("reviews");

    await product.save();

    res.status(201).json({
        success: true,
        message: "Review added successfully",
        numReviews: product.numReviews,
        reviews: product.reviews,
    });

});

const updateProductReview = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const userId = req.user._id;

    const { rating, comment } = req.body || {};

    if (rating === undefined && comment === undefined) {
        res.status(400);
        throw new Error("Nothing to update");
    }

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    const reviewIndex = product.reviews.findIndex(
        (r) => r?.user && r.user.toString() === userId.toString()
    );

    if (reviewIndex === -1) {
        res.status(404);
        throw new Error("Review not found for this user");
    }

    // rating update
    if (rating !== undefined) {

        if (rating < 1 || rating > 5) {
            res.status(400);
            throw new Error("Rating must be between 1 and 5");
        }

        product.reviews[reviewIndex].rating = Number(rating);
    }

    // comment update
    if (comment !== undefined) {
        product.reviews[reviewIndex].comment = comment;
    }

    product.reviews[reviewIndex].updatedAt = new Date();

    // ⭐ recalculate rating
    product.rating =
        product.reviews.reduce((acc, item) => acc + item.rating, 0) /
        product.reviews.length;

    product.markModified("reviews");

    await product.save();

    res.status(200).json({
        success: true,
        message: "Review updated successfully",
        rating: product.rating,
        reviews: product.reviews,
    });
});

const deleteProductReview = asyncHandler(async (req, res) => {

    const productId = req.params.id;
    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    const reviewIndex = product.reviews.findIndex(
        (r) => r?.user && r.user.toString() === userId.toString()
    );

    if (reviewIndex === -1) {
        res.status(404);
        throw new Error("Review not found for this user");
    }

    // remove review
    product.reviews.splice(reviewIndex, 1);

    product.numReviews = product.reviews.length;

    // ⭐ recalc rating
    if (product.reviews.length > 0) {
        product.rating =
            product.reviews.reduce((acc, item) => acc + item.rating, 0) /
            product.reviews.length;
    } else {
        product.rating = 0;
    }

    product.markModified("reviews");

    await product.save();

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        numReviews: product.numReviews,
        rating: product.rating,
        reviews: product.reviews,
    });

});

const getProductReviews = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // sorting
    const sort = req.query.sort || "latest";

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    let reviews = [...product.reviews]; // copy array safely

    // ✅ Sorting logic
    if (sort === "latest") {
        reviews.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    if (sort === "highest") {
        reviews.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "lowest") {
        reviews.sort((a, b) => a.rating - b.rating);
    }

    const totalReviews = reviews.length;

    // ✅ Pagination
    const paginatedReviews = reviews.slice(skip, skip + limit);

    res.status(200).json({
        success: true,
        page,
        limit,
        totalReviews,
        totalPages: Math.ceil(totalReviews / limit),
        reviews: paginatedReviews,
    });
});

export {
    createProduct,
    getSpesificProduct,
    updateSpesificProduct,
    toggleProductStatus,
    deleteProduct,
    getAllProduct,
    getSellerAllProducts,
    createProductReview,
    updateProductReview,
    deleteProductReview,
    getProductReviews,
};


// Get all products
// "GET /products",

// Pagination
// "GET /products?page=2&limit=5",

// Search
// "GET /products?keyword=iphone",

// Filter
// "GET /products?category_id=101",

// Sort
// "GET /products?sort=price_desc"


// Latest Reviews(default )
// GET /6942585e4e8ee5901e43614b/reviews

// Pagination
// GET /6942585e4e8ee5901e43614b/reviews?page=1&limit=10

// Highest Rating First
// GET /6942585e4e8ee5901e43614b/reviews?sort=highest

// Lowest Rating First
// GET /6942585e4e8ee5901e43614b/reviews?sort=lowest


