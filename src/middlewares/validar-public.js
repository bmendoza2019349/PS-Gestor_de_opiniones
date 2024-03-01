import Public from '../publications/public.model.js';

export const validarPublic = (req, res, next) => {
    const { category } = req.body;

    const validCategories = ["Estado", "Historia", "Actividad", "Evento", "Recuerdo"];

    if (!validCategories.includes(category)) {
        return res.status(400).json({
            error: `Invalid category. Valid categories are: ${validCategories.join(', ')} starting with a capital letter`,
        });
    }

    // If the category is valid, proceed to the next middleware or route handler
    next();
};