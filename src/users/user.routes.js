import { Router } from "express";
import { check } from "express-validator";
import { usuariosPost, usersPut } from "./user.controller.js";
import { existeEmailUsuario, existeUserById } from "../helpers/db-validartors.js";
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarUsuario } from "../middlewares/validar-users.js";
const router = Router();

router.post(
    "/",
    [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("password", "El password debe ser mayor a 4 caracteres").isLength({
            min: 4,
        }),
        check("email", "Este no es un correo válido").isEmail(),
        check("email").custom(existeEmailUsuario),
        validarCampos,
    ], usuariosPost
);

router.put(
    "/:id",
    [
        validarJWT,
        validarCampos,
        validarUsuario,
    ], usersPut);

export default router;