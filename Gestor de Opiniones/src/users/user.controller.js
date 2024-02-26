import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model';

export const usuariosPost = async (req, res) => {
    const { nombre, correo, password} = req.body;
    const user = new User({nombre, correo, password});

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await usuariosPost.save();

    res.status(200).json({
        user
    });
}