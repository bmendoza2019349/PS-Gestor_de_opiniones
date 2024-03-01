import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Public from './public.model.js';
import User from '../users/user.model.js';
import { validatePublicComentD } from "../middlewares/valid-publications.js";

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
    try {
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

} catch (error) {
    console.error("Error deleting publication:", error);
    res.status(500).json({ error: "Internal Server Error" });
}
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
        const {idPublications, text } = req.body;
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
        const { user } = req;
        const { commentId, text } = req.body;
        const publication = req.publication; // Accessing publication from the request object
        const comment = req.comment; // Accessing comment from the request object

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
        // You can now access the publication from the request object
        const publication = req.publication;

        const { commentId } = req.body;
        const commentIndex = publication.comments.findIndex(comment => comment._id.toString() === commentId);

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