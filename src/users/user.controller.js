import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

export const usuariosPost = async (req, res) => {
    const { name, email, password} = req.body;
    const user = new User({name, email, password});

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        msg: "The user was added successfully",
        user
    });
}

export const usersPut = async (req, res = response) => {
    const { id } = req.params;
    const {_id, password, email, ...resto} = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    await User.findByIdAndUpdate(id, resto);
    const usuario = await User.findOne({_id: id});

    res.status(200).json({
        msg: 'The user has been successfully updated',
        usuario
    })
    
}