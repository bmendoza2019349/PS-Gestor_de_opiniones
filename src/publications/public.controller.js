import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Public from './public.model.js';
import User from '../users/user.model.js';

export const publicPost = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        // Create a new instance of the 'Public' model
        const publication = new Public({ title, category, content, user: userId });

        // Save the publication to the database
        await publication.save();

        res.status(200).json({
            msg: "The publication was created successfully",
            publication,
        });
    } catch (error) {
        console.error("Error creating publication:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const publicPut = async (req, res = response) => {
    const { id } = req.params;
    const { user } = req;
    const { _id, ...resto } = req.body;

    const publics = await Public.findById(id);

    if (!publics || publics.user.toString() !== user._id.toString()) {
        return res.status(403).json({
            msg: 'Acceso no autorizado. Solo el usuario propietario puede actualizar esta publicacion.',
        });
    }

    const publicationsActualizada = await Public.findByIdAndUpdate(id, resto);


    res.status(200).json({
        msg: 'The post was updated successfully.',
        publics: publicationsActualizada
    });
}

export const publicDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;

        const publics = await Public.findById(id);

        if (!publics || publics.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                msg: 'Acceso no autorizado. Solo el usuario propietario puede eliminar esta publicacion.',
            });
        }

        // Delete the publication
        await Public.findByIdAndDelete(id);

        res.status(200).json({
            msg: 'The publication was deleted successfully.',
        });
    } catch (error) {
        console.error("Error deleting publication:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        const comment = {
            text,
            user: userId,
        };

        const publication = await Public.findById(id);

        if (!publication) {
            return res.status(404).json({
                msg: 'Publication not found',
            });
        }

        publication.comments.push(comment);

        await publication.save();

        res.status(200).json({
            msg: 'Comment added successfully',
            publication,
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getComments = async (req, res = response) => {
    try {
        const { id } = req.params;

        const publication = await Public.findById(id);

        if (!publication) {
            return res.status(404).json({
                msg: 'Publication not found',
            });
        }

        const comments = publication.comments;

        res.status(200).json({
            publication
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateComment = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const { commentId, text } = req.body;

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

        if (!comment || comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                msg: 'Acceso no autorizado. Solo el usuario propietario puede actualizar este comentario.',
            });
        }

        comment.text = text;

        await publication.save();

        res.status(200).json({
            msg: 'Comment updated successfully',
            comment,
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteComment = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { commentId } = req.body;
        const { user } = req; // Assuming your user object in the token is stored in req.user

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

        // Delete the comment
        publication.comments.splice(commentIndex, 1);
        await publication.save();

        res.status(200).json({
            msg: 'Comment deleted successfully',
            publication,
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};