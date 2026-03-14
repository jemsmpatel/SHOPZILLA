import Category from "../models/Category.js";

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, slug, description, parent_id, image } = req.body;

        const categoryExists = await Category.findOne({ slug });
        if (categoryExists) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = await Category.create({
            name,
            slug,
            description,
            parent_id: parent_id || null,
            image,
        });

        res.status(201).json({
            success: true,
            data: category,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.name = req.body.name || category.name;
        category.slug = req.body.slug || category.slug;
        category.description = req.body.description || category.description;
        category.parent_id =
            req.body.parent_id !== undefined
                ? req.body.parent_id
                : category.parent_id;
        category.image = req.body.image || category.image;

        const updatedCategory = await category.save();

        res.json({
            success: true,
            data: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL CATEGORIES (Advanced)
const getAllCategories = async (req, res) => {
    try {
        const { tree, active } = req.query;

        // -------------------------
        // FILTER LOGIC
        // -------------------------
        let filter = {};

        // Only apply active filter if active=true
        if (active === "true") {
            filter.isActive = true;
        }

        const categories = await Category.find(filter)
            .populate("parent_id", "name slug")
            .sort({ createdAt: -1 })
            .lean();

        // -------------------------
        // TREE STRUCTURE LOGIC
        // -------------------------
        if (tree === "true") {

            const categoryMap = {};
            const parentCategories = [];

            // Step 1: Create map
            categories.forEach((cat) => {
                categoryMap[cat._id] = {
                    ...cat,
                    subCategories: []
                };
            });

            // Step 2: Build tree
            categories.forEach((cat) => {
                if (cat.parent_id) {
                    const parentId = cat.parent_id._id || cat.parent_id;

                    if (categoryMap[parentId]) {
                        categoryMap[parentId].subCategories.push(
                            categoryMap[cat._id]
                        );
                    }
                } else {
                    parentCategories.push(categoryMap[cat._id]);
                }
            });

            return res.json({
                success: true,
                tree: true,
                count: parentCategories.length,
                data: parentCategories,
            });
        }

        // -------------------------
        // NORMAL RESPONSE
        // -------------------------
        return res.json({
            success: true,
            tree: false,
            count: categories.length,
            data: categories,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ONLY PARENT CATEGORIES
const getParentCategories = async (req, res) => {
    try {
        const categories = await Category.find({ parent_id: null });

        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.deleteOne();

        res.json({
            success: true,
            message: "Category removed successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ACTIVE / DEACTIVE CATEGORY
const toggleCategoryStatus = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.isActive = !category.isActive;
        await category.save();

        res.json({
            success: true,
            message: `Category ${category.isActive ? "Activated" : "Deactivated"
                } successfully`,
            isActive: category.isActive,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET CATEGORY BY ID
const getCategoryById = async (req, res) => {
  try {

    const category = await Category.findById(req.params.id)
      .populate("parent_id", "name slug");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export {
    createCategory,
    updateCategory,
    getAllCategories,
    getParentCategories,
    deleteCategory,
    toggleCategoryStatus,
    getCategoryById,
};