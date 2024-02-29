import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Public from './public.model.js';

export const publicPost = async (req, res) => {
    try {
        const { title, category, comments } = req.body;

        // Create a new instance of the 'Public' model
        const publication = new Public({ title, category, comments });

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
     const {_id, ...resto} = req.body;

     await Public.findByIdAndUpdate(id, resto);

     const publications = await Public.findOne({_id: id});

     res.status(200).json({
         msg: 'The post was updated successfully.',
         publications
     });
 }

 export const publicDelete = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        // Delete the publication
        const deletedPublication = await Public.findByIdAndDelete(id);

        if (!deletedPublication) {
            return res.status(404).json({ error: 'Publication not found' });
        }

        res.status(200).json({
            msg: 'The publication was deleted successfully.',
            publication: deletedPublication,
        });
    } catch (error) {
        console.error("Error deleting publication:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};