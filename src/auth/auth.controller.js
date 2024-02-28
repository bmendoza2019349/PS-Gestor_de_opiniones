import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const {usuario, password} = req.body;

    try {
        const user = await User.findOne({ $or: [{email: usuario}, {name: usuario}] });

        if(!user){
            return res.status(400).json({
                msg: "Credenciales incorrectas, Correo o Nombre no existe en la base de datos",
            });
        }

        if(!user.estado === "Habilitado"){
            return res.status(400).json({
                msg: "El usuario no existe en la base de datos",
            });
        }

        if (user.estado === "Suspendido") {
            return res.status(400).json({
                msg: "El usuario está suspendido",
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: "La contraseña es incorrecta",
            });
        }

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