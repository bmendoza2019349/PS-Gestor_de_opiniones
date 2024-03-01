import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';

// Middleware para validar la contraseña antes de la actualización
// 
export const validarUsuario = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        if (email && !email.includes('@')) {
            return res.status(400).json({
                msg: "El campo 'email' debe contener el carácter '@'",
            });
        }
        

        if (req.body.password) {
            // Si se está actualizando la contraseña, verificar la contraseña anterior
            const { id } = req.params;
            const { password, newPassword } = req.body;

            if (!password || !newPassword) {
                return res.status(400).json({
                    msg: "Se requiere la contraseña anterior y la nueva contraseña para actualizarla",
                });
            }

            const usuario = await User.findById(id);
            const isPasswordValid = bcryptjs.compareSync(password, usuario.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    msg: "La contraseña anterior no es válida",
                });
            }

            // Hash de la nueva contraseña
            const salt = bcryptjs.genSaltSync(); // por default tiene 10 vueltas
            usuario.password = bcryptjs.hashSync(newPassword, salt);

            // Guardar los cambios en el documento del usuario
            await usuario.save();
        }

        // Si se está actualizando el nombre, solo se requiere el campo "name" en el body

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Contacta al administrador',
        });
    }
};

export const validarUser = (req, res, next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(403).json({
                msg: 'Acceso no autorizado. Solo profesores pueden realizar esta acción.',
            });
        }

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error en la validación de profesores',
            error: error.message,
        });
    }
};

