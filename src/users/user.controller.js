import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import { existeEmailUsuario, existeUserById } from "../helpers/db-validartors.js";
import User from './user.model.js';

export const usuariosPost = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        await user.save();

        res.status(200).json({
            msg: "The user was added successfully",
            user
        });
    } catch (error) {
        res.status(409).json({
            error: error.message,
        });
    }
}

export const usersPut = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password, ...resto } = req.body;

        await User.findByIdAndUpdate(id, resto); // Actualiza el usuario sin cambiar la contraseña
        const usuario = await User.findOne({ _id: id });

        res.status(200).json({
            msg: 'The user has been successfully updated',
            usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Contact the administrator",
        });
    }
};