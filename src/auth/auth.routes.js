import { Router } from "express";
import { check } from "express-validator";

import { login } from './auth.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(
    '/login',
    [
        check('password', 'El password es obligatorio').not().isEmpty(),
        // Ahora, permitimos que sea email o name
        check('usuario', 'El correo o nombre es obligatorio').not().isEmpty(),
        validarCampos,
    ], login);

    export default router;