import Category from "../models/categories.js";

// POST - Create a new category
export const createCategory = async (req, res) => {
    try {
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
                statuscode: 400
            });
        }

        const existingCategory = await Category.findOne({ category_name });
        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists",
                statuscode: 409
            });
        }

        const category = await Category.create({ category_name });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
            statuscode: 201
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
            statuscode: 500
        });
    }
};

// GET - Fetch all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            count: categories.length,
            data: categories,
            statuscode: 200
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
            statuscode: 500
        });
    }
};

// GET - Fetch a single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
                statuscode: 404
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category,
            statuscode: 200
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
            statuscode: 500
        });
    }
};