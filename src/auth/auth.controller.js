import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';
import { validarLogin } from '../middlewares/validarLogin.js';

export const login = async (req, res) => {

    try {
        const user = await User.findOne(req.loginUser);


        const token = await generarJWT(user.id);
        res.status(200).json({
            msg: 'Access Granted',
            user,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Contact the administrator",
        });
    }
}