import User from '../users/user.model.js';

export const existeEmailUsuario = async(correo = '') =>{
    const existeEmail = await User.findOne({correo});
    if(existeEmail){
        throw new Error(`El email ${correo} ya fue registrada`);
    }
}

export const existeUserById = async (id = '') =>{
    const existeUser = await User.findById(id);
    if(!existeUser){
        throw new Error(`El ID: ${correo} No existe`);
    }
}
