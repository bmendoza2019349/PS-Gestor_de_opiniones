import { validationResult } from 'express-validator';
import Public from '../publications/public.model.js'

export const validatePublicComentD = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { commentId } = req.body;
        const { user } = req;

        const publication = await Public.findById(id);

        if (!publication) {
            return res.status(404).json({
                msg: 'Publication not found',
            });
        }

        const commentIndex = publication.comments.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({
                msg: 'Comment not found',
            });
        }

        const comment = publication.comments[commentIndex];

        // Check ownership before deleting the comment
        if (comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                msg: 'Acceso no autorizado. Solo el usuario propietario puede eliminar este comentario.',
            });
        }

        req.publication = publication; // Attach the publication to the request object
        next();
    } catch (error) {
        console.error("Error validating publication ownership:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const validateUpdateComment = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { user } = req;
        const { commentId } = req.body;

        const publication = await Public.findById(id);

        if (!publication) {
            return res.status(404).json({
                msg: 'Publication not found',
            });
        }

        const comment = publication.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({
                msg: 'Comment not found',
            });
        }

        if (comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                msg: 'Acceso no autorizado. Solo el usuario propietario puede actualizar este comentario.',
            });
        }

        // Attach the publication and comment to the request object for later use
        req.publication = publication;
        req.comment = comment;

        next();
    } catch (error) {
        console.error("Error validating update comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};