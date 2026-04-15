import Models from "../models/models.js";
import Category from "../models/categories.js";

// POST - Create a new model
export const createModel = async (req, res) => {
    try {
        const { model_name, category, link, model_attributes } = req.body;

        if (!model_name || !category || !link) {
            return res.status(400).json({
                success: false,
                message: "model_name, category and link are required",
                statuscode: 400
            });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
                statuscode: 404
            });
        }

        const existingModel = await Models.findOne({ model_name });
        if (existingModel) {
            return res.status(409).json({
                success: false,
                message: "Model with this name already exists",
                statuscode: 409
            });
        }

        // Validate model_attributes shape: [{ name, dtype }]
       const attrs = Array.isArray(model_attributes)
    ? model_attributes
        .filter((a) => a?.name && a?.dtype)
        .map(({ name, dtype, value = "", isActive = true }) => ({
            name, dtype, value, isActive
        }))
    : [];

        const model = await Models.create({
            model_name,
            category,
            link,
            model_attributes: attrs
        });

        const populated = await model.populate("category", "category_name");

        return res.status(201).json({
            success: true,
            message: "Model created successfully",
            data: populated,
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


// GET - Fetch all models
export const getAllModels = async (req, res) => {
    try {
        const models = await Models.find()
            .populate("category", "category_name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Models fetched successfully",
            count: models.length,
            data: models,
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

// GET - Fetch single model by ID
export const getModelById = async (req, res) => {
    try {
        const { id } = req.params;

        const model = await Models.findById(id).populate("category", "category_name");
        if (!model) {
            return res.status(404).json({
                success: false,
                message: "Model not found",
                statuscode: 404
            });
        }

        return res.status(200).json({
            success: true,
            message: "Model fetched successfully",
            data: model,
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

// GET - Fetch all models by category ID
export const getModelsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
                statuscode: 404
            });
        }

        const models = await Models.find({ category: categoryId })
            .populate("category", "category_name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Models fetched successfully",
            count: models.length,
            data: models,
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

// PATCH - Update a model by ID
export const updateModel = async (req, res) => {
    try {
        const { id } = req.params;
        const { model_name, category, link, model_attributes } = req.body;

        const model = await Models.findById(id);
        if (!model) {
            return res.status(404).json({
                success: false,
                message: "Model not found",
                statuscode: 404
            });
        }

        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                    statuscode: 404
                });
            }
        }

        if (model_name && model_name !== model.model_name) {
            const duplicate = await Models.findOne({ model_name });
            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "Model with this name already exists",
                    statuscode: 409
                });
            }
        }

        const updateFields = {};
        if (model_name) updateFields.model_name = model_name;
        if (category)   updateFields.category   = category;
        if (link)       updateFields.link        = link;

        // Validate model_attributes shape: [{ name, dtype }]
        if (model_attributes) {
           updateFields.model_attributes = Array.isArray(model_attributes)
    ? model_attributes
        .filter((a) => a?.name && a?.dtype)
        .map(({ name, dtype, value = "", isActive = true }) => ({
            name, dtype, value, isActive
        }))
    : [];
        }

        const updatedModel = await Models.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).populate("category", "category_name");

        return res.status(200).json({
            success: true,
            message: "Model updated successfully",
            data: updatedModel,
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


// DELETE - Delete a model by ID
export const deleteModel = async (req, res) => {
    try {
        const { id } = req.params;

        const model = await Models.findById(id);
        if (!model) {
            return res.status(404).json({
                success: false,
                message: "Model not found",
                statuscode: 404
            });
        }

        await Models.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Model deleted successfully",
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