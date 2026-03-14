import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/Product.js";


// ================= GET ALL PRODUCTS =================
const getAllProduct = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 🔎 Search by name or brand
    const keyword = req.query.keyword
        ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { brand: { $regex: req.query.keyword, $options: "i" } }
            ],
        }
        : {};

    // 🎯 Filters
    const filter = {
        ...keyword,
        ...(req.query.category_id && { category_id: req.query.category_id }),
        ...(req.query.isActive && { isActive: req.query.isActive === "true" }),
    };

    // 🔃 Sorting
    let sortBy = { createdAt: -1 }; // latest first
    if (req.query.sort === "price_asc") sortBy = { price: 1 };
    if (req.query.sort === "price_desc") sortBy = { price: -1 };
    if (req.query.sort === "rating") sortBy = { reviews: -1 };

    // 📦 Fetch products
    const products = await Product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit);

    // 🔢 Total count
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
        success: true,
        totalProducts,
        page,
        totalPages: Math.ceil(totalProducts / limit),
        products,
    });
});

// ================= ENABLE / DISABLE PRODUCT =================
const toggleProductStatus = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // Toggle logic
    product.isActive = !product.isActive;

    await product.save();

    res.status(200).json({
        message: `Product ${product.isActive ? "enabled" : "disabled"} successfully`,
        productId: product._id,
        isActive: product.isActive,
    });

});

const deleteProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    // Soft delete
    product.isActive = null;

    await product.save();

    res.status(200).json({
        message: "Product deleted successfully",
        productId: product._id,
        isActive: product.isActive
    });

});

const admincreateProduct = asyncHandler(async (req, res) => {
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
    if (price > mrp_price) {
        res.status(400);
        throw new Error("Selling price cannot be greater than MRP");
    }

    // ✅ Calculate discount automatically
    const discount_rate = Math.round(
        ((mrp_price - price) / mrp_price) * 100
    );

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

export { getAllProduct, toggleProductStatus, deleteProduct, admincreateProduct };