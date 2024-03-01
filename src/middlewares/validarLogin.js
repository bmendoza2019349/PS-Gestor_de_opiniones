import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';

export const validarLogin = async (req, res, next) => {
    const { usuario, password } = req.body;

    try {
        
        let user;

        // Corregir la función a 'includes'
        const isEmail = usuario.includes('@');

        if (isEmail) {
            user = await User.findOne({ email: usuario });
        } else {
            user = await User.findOne({ name: usuario });
        }

        if (!user) {
            return res.status(400).json({
                msg: "Credenciales incorrectas, Correo o Nombre no existe en la base de datos",
            });
        }

        if (user.state !== "Habilitado") {
            return res.status(400).json({
                msg: "El usuario no está habilitado en la base de datos",
            });
        }

        if (user.state === "Suspendido") {
            return res.status(400).json({
                msg: "El usuario está suspendido",
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "La contraseña es incorrecta",
            });
        }

        req.loginUser = user;  // Agregar el usuario al objeto request para que el controlador lo utilice
        next();  // Llama a la siguiente función en la cadena de middleware

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Contact the administrator",
        });
    }
};