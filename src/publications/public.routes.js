import { Router } from 'express';
import { check } from 'express-validator';
import { publicPost, publicPut, publicDelete } from './public.controller.js';
import {validarCampos } from '../middlewares/validar-campos.js';
// import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// router.post(
//     "/",
//     [
//       check("title", "The title is mandatory").not().isEmpty(),
//       check("category", "The category is mandatory").not().isEmpty(),
//       check("comments", "Comments must be an array").isArray(),
//       validarCampos,
//     ],
//     publicPost
//   );

router.post(
    "/",
    [
      check("title", "The title is mandatory").not().isEmpty(),
      check("category", "The category is mandatory").not().isEmpty(),
      check("comments", "The comments is mandatory").not().isEmpty(),
      validarCampos,
    ],
    publicPost
  );

  router.put(
    "/:id", // Assuming you are passing the id as a URL parameter
    [
      check("title", "The title is mandatory").not().isEmpty(),
      check("category", "The category is mandatory").not().isEmpty(),
      validarCampos,
    ],
    publicPut
);

router.delete("/:id", publicDelete);

  export default router;